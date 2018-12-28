import firebase from 'firebase';
import base from './rebase';
import { getPaginatedFeed } from './index';
import { getAuth } from './auth';
import moment from 'moment';

const TIMELINE_PAGE_SIZE = 7;

let db = base.initializedApp.database();
let auth = getAuth();

// should use getPaginatedFeed internally, means we need to determine the Value we need

export function getUpcoming(timeStamp = null) {
	// events the user is attending ordered by chronology.
	// the key is postId and the value is event_timestamp
	// ascending timestamp == chronological order.
	let ref = db.ref(`/attends_user/${auth.currentUser.uid}`).orderByValue();
	let currentTimestamp = timeStamp;
	if (!currentTimestamp) {
		currentTimestamp = moment().valueOf(); // this is "right now"
	}
	let nearFuturePageRef = ref.startAt(currentTimestamp).limitToFirst(TIMELINE_PAGE_SIZE + 1);
	return nearFuturePageRef.once('value').then(data => {
		const entries = data.val() || {};

		let nextPage = null;
		const entryIds = Object.keys(entries); //postIds
		// check if there is a next page
		if (entryIds.length > TIMELINE_PAGE_SIZE) {
			const furthestInFuturePostId = entryIds[entryIds.length - 1];
			const furthestInFutureTimeStampVal = entries[furthestInFuturePostId];
			delete entries[furthestInFuturePostId];
			const nextPageStartingTimestamp = furthestInFutureTimeStampVal;

			nextPage = () => getUpcoming(nextPageStartingTimestamp);
		}

		return {entries: entries, nextPage: nextPage}
	})
}

export function getRecentPast(timestamp = null) {
	let ref = db.ref(`/attends_user/${auth.currentUser.uid}`).orderByValue();
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

			nextPage = () => getRecentPast(nextPageStartingTimestamp);
		}

		return {entries: entries, nextPage: nextPage}
	})
}