import base from './rebase';
import { getPostData } from './post';
import moment from 'moment';

const db = base.initializedApp.database();
const FUCKING_DISCOVER_PAGE_SIZE = 10;
/**
 * Logs an interaction under the
 *
 * We return a `Promise` which resolves with an Map of posts and a function to the next page or
 * `null` if there is no next page.
 */
export function recordUserActivity(currentUser, postId, event_timestamp, interactionType) {
	const activity_uri = `/activity/${currentUser.uid}`;
	const activity_info = {
		'postId': postId,
		'event_timestamp': event_timestamp,
		'username': currentUser.username,
		'uid': currentUser.uid,
		'interaction_type': interactionType
	}
	// this endpoint will also be indexed on child event_timestamp
	return db.ref(activity_uri).push(activity_info);
}

export function updateDiscoverFeed(currentUserUid) {
	const followingRef = db.ref(`/people/${currentUserUid}/following`);
	return followingRef.once('value', data => {
		const following = data.val();
		if (!following) {
			return;
		}
		const updateOperations = Object.keys(following).map(followedUserUid => {
			let followedUserActivityRef = db.ref(`/activity/${followedUserUid}`);
			let followedData = following[followedUserUid];
			const lastSyncedActivityId = followedData.hasOwnProperty('activity') ? followedData.activity : false;
			if (!!lastSyncedActivityId) {
				followedUserActivityRef = followedUserActivityRef.orderByKey().startAt(lastSyncedActivityId);
			}
			return followedUserActivityRef.once('value', data => {
				const updates = {};
				const followedUserActivity = data.val();
				if (!followedUserActivity) {
					return;
				}
				Object.keys(followedUserActivity).forEach(activityId => {
					let record = followedUserActivity[activityId];
					if (activityId !== lastSyncedActivityId) {
						// this should also be indexed on event_timestamp :)
						updates[`/discover/${currentUserUid}/${record.postId}`] = record;
						// track the last activity we've seen for this follow-ee
						updates[`/people/${currentUserUid}/following/${followedUserUid}/activity`] = activityId;
					}
				});
				return db.ref().update(updates);
			});
		});
		return Promise.all(updateOperations);
	});
}

/**
 * Paginates activity from the accounts the user follows.
 *
 * We return a `Promise` which resolves with an Map of posts and a function to the next page or
 * `null` if there is no next page.
 */
export function getDiscoverFeedPosts(currentUserUid, startTimestamp = null, pageSize = FUCKING_DISCOVER_PAGE_SIZE) {
	let ref = db.ref(`/discover/${currentUserUid}`);
	if (startTimestamp) {
		ref = ref.orderByChild('event_timestamp').startAt(startTimestamp);
	} else {
		const rightNowTimestamp = moment().valueOf();
		ref = ref.orderByChild('event_timestamp').startAt(rightNowTimestamp);
	}
	// since we start the query at 'today', limitToFirst will give us the first
	// pageSize entries AFTER today, a.k.a. what events are coming up
	return ref.limitToFirst(pageSize + 1).once('value').then(data => {
		const entries = data.val() || {};
		let nextPage = null;
		const entryIds = Object.keys(entries);
		if (entryIds.length > pageSize) {
			delete entries[entryIds[entryIds.length - 1]];
			const lastEntryId = entryIds.pop();
			const nextPageStartTime = entries[lastEntryId].event_timestamp;

			nextPage = () => getDiscoverFeedPosts(currentUserUid, nextPageStartTime);
		}

		let discoverPosts = {};
		entryIds.forEach(id => {
			const postId = entries[id].postId;
			discoverPosts[postId] = {};
			discoverPosts[postId].friendInfo = entries[id];
		});

		const postQueries = entryIds.map(id => getPostData(entries[id].postId));
		// fill out the additional post data and return it all at once
		return Promise.all(postQueries).then(results => {
			results.forEach(result => {
				// check that the event still exists, cause it might not
				if (result.val()) {
					const postId = result.key;
					// result.key is postId, result.val() is post data
					discoverPosts[postId].postInfo = result.val();
				}
			});
			return {entries: discoverPosts, nextPage: nextPage};
		});
	});
}