import firebase from 'firebase';
import base from './rebase';
import { getFeedPostData } from './feed';
import moment from 'moment';

const TIMELINE_PAGE_SIZE = 7;

let db = base.initializedApp.database();

export function getUpcomingEvents(uid, timeStamp = null) {
	// attends_user/${uid} is a lsit of (key, val) pairs, where the key
  // is a postId and the value is its event_timestamp
	let ref = db.ref(`/attends_user/${uid}`).orderByValue();
  let currentTimestamp = timeStamp == null ? moment().valueOf() : timeStamp;

  // ref for the N most recent postIDS from attends_user.
	let nearFuturePageRef = ref.startAt(currentTimestamp).limitToFirst(TIMELINE_PAGE_SIZE + 1);
	return nearFuturePageRef.once('value').then(data => {
		const entries = data.val() || {};

		let nextPage = null;
		const entryIds = Object.keys(entries); //postIds
		// check if there exists another page of data
		if (entryIds.length > TIMELINE_PAGE_SIZE) {
			const furthestInFuturePostId = entryIds[entryIds.length - 1];
			const furthestInFutureTimeStampVal = entries[furthestInFuturePostId];
			delete entries[furthestInFuturePostId];
			const nextPageStartingTimestamp = furthestInFutureTimeStampVal;

			nextPage = () => getUpcomingEvents(nextPageStartingTimestamp);
		}

    return getFeedPostData(entryIds).then(results => {
  		return {entries: results, nextPage: nextPage}
    });
	})
}

export function getRecentPastEvents(uid, timestamp = null) {
	let ref = db.ref(`/attends_user/${uid}`).orderByValue();
	let currentTimestamp = timestamp;
	if (!currentTimestamp) {
		currentTimestamp = moment().valueOf();
	}
	let recentPastPageRef = ref.endAt(currentTimestamp).limitToLast(TIMELINE_PAGE_SIZE + 1);
	return recentPastPageRef.once('value').then(data => {
		const entries = data.val() || {};

		let nextPage = null;
		const entryIds = Object.keys(entries); // postIds
		// check if there is a next page
		if (entryIds.length > TIMELINE_PAGE_SIZE) {
			const oldestPostId = entryIds[0];
			const oldestTimeStampVal = entries[oldestPostId];
			delete entries[oldestPostId]; // this is the oldest one
			const nextPageStartingTimestamp = oldestPostId;

			nextPage = () => getRecentPastEvents(nextPageStartingTimestamp);
		}

		return {entries: entries, nextPage: nextPage}
	})
}