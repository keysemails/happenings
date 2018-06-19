import firebase from 'firebase';
import base from './rebase';
import { getPaginatedFeed } from './index';
import { PAGE_SIZES } from '../constants';

const db = base.initializedApp.database();

export function getPosts(uri, pageSize) {
	return getPaginatedFeed(uri, pageSize, null, true);
}

// get posts of a given user
export function getUserFeedPosts(uid) {
	return getPosts(`/people/${uid}/posts`,
		PAGE_SIZES.DISCOVER_FEED);
}

/**
 * Looks for new posts from people you follow
 * We return a `Promise` which resolves with an Map of posts and a function to the next page or
 * `null` if there is no next page.
 */
export function updateMainFeed(currentUserUid) {
	const ref = db.ref(`/people/${currentUserUid}/following`);
	return ref.once('value', data => {
		const following = data.val();
		if (!following) {
			return;
		}

		// just got all ppl we're following
		// next, check for NEW posts for each person we're following

		const updateOperations = Object.keys(following).map(followedUid => {
			let followedUserPostsRef = db.ref(`/people/${followedUid}/posts`);
			// the followed's latest postID that the user has already synced into their /feed/
			const lastSyncedPostId = following[followedUid].posts;
			if (lastSyncedPostId instanceof String) {
				followedUserPostsRef = followedUserPostsRef.orderByKey().startAt(lastSyncedPostId);
			}
			return followedUserPostsRef.once('value', postData => {
				const updates = {};
				if (!postData.val()) {
					return;
				}
				// check for New Content and update db accordingly
				Object.keys(postData.val()).forEach(postId => {
					if (postId !== lastSyncedPostId) {
						updates[`/feed/${currentUserUid}/${postId}`] = true;
						updates[`/people/${currentUserUid}/following/${followedUid}/posts`] = postId;
					}
				});
				return db.ref().update(updates);
			});
		});
		return Promise.all(updateOperations);
	});
}

/**
 * Paginates posts from the user's home feed.
 *
 * We return a `Promise` which resolves with an Map of posts and a function to the next page or
 * `null` if there is no next page.
 */
export function getMainFeedPosts(currentUserUid) {
	return getPaginatedFeed(`/feed/${currentUserUid}`,
		PAGE_SIZES.DISCOVER_FEED, null, true);
}

/**
 * Paginates activity from the accounts the user follows.
 *
 * We return a `Promise` which resolves with an Map of posts and a function to the next page or
 * `null` if there is no next page.
 */
export function getDiscoverFeedPosts(currentUser) {
	return getPaginatedFeed(`/discover/${currentUser}`,
		PAGE_SIZES.DISCOVER_FEED, null, true);
}
