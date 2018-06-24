import firebase from 'firebase';
import base from './rebase';
import 'whatwg-fetch';
import { getPostData } from './post';
import { getAuth } from './auth';

const db = base.initializedApp.database();

export function deleteFromFeed(uri, key) {
	return uri;
}

export function getPaginatedFeed(uri, pageSize, earliestEntryId = null, fetchPostDetails = false) {
	let ref = base.initializedApp.database().ref(uri);
	if (earliestEntryId) {
		ref = ref.orderByKey().endAt(earliestEntryId);
	}
	// we're fetching an additional item as a cheap way to test if there's a next page.
	return ref.limitToLast(pageSize + 1).once('value').then(data => {
		const entries = data.val() || {};

		//figure out if theres a next page
		let nextPage = null;
		const entryIds = Object.keys(entries);
		if (entryIds.length > pageSize) {
			delete entries[entryIds[0]];
			const nextPageStartingId = entryIds.shift();

			nextPage = () => getPaginatedFeed(
				uri, pageSize, nextPageStartingId, fetchPostDetails
			);
		}
		if (fetchPostDetails) {
			// fetch details of all posts. TODO: maybe do away with this entirely??
			const queries = entryIds.map(postId => getPostData(postId));
			// since all the requests are being done on the same feed, its unlikely that a single
			// one would fail and not the others so using Promise.all() is not so risky.
			return Promise.all(queries).then(results => {
				const deleteOps = [];
				results.forEach(result => {
					if (result.val()) {
						entries[result.key] = result.val();
					} else {
						// we encountered a delted post. remove it permanently from teh feed.
						delete entries[result.key];
						deleteOps.push(deleteFromFeed(uri, result.key));
					}
				});
				if (deleteOps.length > 0) {
					// we had to remove some deleted posts from the feed.
					// lets run the query again to get the correct # of posts.
					return getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);
				}
				return {entries: entries, nextPage: nextPage}
			});
		}
		return {entries: entries, nextPage: nextPage}
	});
}

/**
 * Subscribes to receive updates to the given feed. The given `callback` function gets called
 * for each new entry on the given feed.
 *
 * If provided we'll only listen to entries that were posted after `latestEntryId`. This allows to
 * listen only for new feed entries after fetching existing entries using `_getPaginatedFeed()`.
 *
 * If needed the posts details can be fetched. This is useful for shallow post feeds.
 * @private
 */
export function subscribeToFeed(uri, callback, latestEntryId = null, fetchPostDetails = false) {
	let ref = db.ref(uri);
	if (latestEntryId) {
		ref = ref.orderByKey().startAt(latestEntryId);
	}
	ref.on('child_added', data => {
		if (data.key !== latestEntryId) {
			callback(data.key, data.val());
		}
	});
}

/**
 * Follow or Unfollow a user and return a promise once that's done.
 *
 * If the user is now followed we'll add all his posts to the home feed of the follower.
 * If the user is now not followed anymore all his posts are removed from the follower home feed.
 */
export function toggleFollowUser(currUserUid, followeeUid, val) {
	const followVal = val ? !!val : null;
	return db.ref(`/people/${followeeUid}/posts`).once('value').then(
		data => {
			const payload = {};
			let lastPostId = true;

			// add or remove followed user's posts to the home feed.
			data.forEach(post => {
				payload[`/feed/${currUserUid}/${post.key}`] = followVal;
				lastPostId = post.key;
			});
			// add or remove the signed-in user to the list of followers.
			payload[`/followers/${followeeUid}/${currUserUid}`] =
				followVal;

			// add or remove followed user to the 'following' list.
			payload[`/people/${currUserUid}/following/${followeeUid}/posts`] =
				val ? lastPostId : null;

			return db.ref().update(payload);
		}
	);
}

// helper to flatten a dict of dicts to an array of dicts
export function toArray(dict) {
	return Object.keys(dict).map(key => {
		return { ...dict[key], key: key }
	});
}

export function getUsername(uid) {
	return db.ref(`/people/${uid}/username`).once('value');
}
