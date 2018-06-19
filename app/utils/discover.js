import base from './rebase';

const db = base.initializedApp.database();
/**
 * Logs an interaction under the
 *
 * We return a `Promise` which resolves with an Map of posts and a function to the next page or
 * `null` if there is no next page.
 */
export function recordUserActivity(uid, username, postId, event, interactionType) {
	const timestamp = event.event_timestamp;
	const discover_uri = `/activity/${uid}`;
	const discover_info = {
		'postId': postId,
		'event_timestamp': event_timestamp,
		'username': username,
		'interaction_type': interaction_type
	}
	// this endpoint will also be indexed on child event_timestamp
	return db.ref(discover_uri).push(discover_info);
}

export function updateDiscoverFeed(currentUserUid) {
	const followingRef = db.ref(`/people/${currentUserUid}/following`);
	return followingRef.once('value', data => {
		const following = data.val();
		if (!following) {
			return;
		}
		const updateOperations = Object.keys(following).map(followedUid => {
			let followedUserActivityRef = db.ref(`/activity/${followedUid}`);
			const lastSyncedActivityId = following[followedUid].activity;
			if (lastSyncedActivityId instanceof String) {
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
						updates[`/discover/${currentUserUid}/${activityId}`] = record;
						updates[`/people/${currentUserUid}/following/${followedUid}/activity`] = activityId;
					}
				});
				return db.ref().update(updates);
			});
		});
		return Promise.all(updateOperations);
	});
}