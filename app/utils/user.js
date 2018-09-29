import firebase from 'firebase';
import base from './rebase';
import latinize from 'latinize';
import { getAuth } from './auth';
import { toggleFollowUser } from './index';

let db = base.initializedApp.database();

export function loadUserByUsername(username) {
	return db.ref('/people/').orderByChild('username').equalTo(username).once('value');
}

export function loadUserData(uid) {
	return db.ref(`/people/${uid}`).once('value');
}

export function getUserByPostId(postId) {
	return db.ref(`/posts/${postId}/author`).once('value');
}

/**
 * Listens to updates on the followers of a person and calls the callback with followers counts.
 * TODO: This won't scale if a user has a huge amount of followers. We need to keep track of a
 *       follower count instead.
 */
export function registerForFollowersCount(uid, callback) {
	const ref = db.ref(`/followers/${uid}`);
	const cb = ref.on('value', data => callback(data.numChildren()));
	return {cb, ref};
}

// gets the number of people a user is following
export function registerForFollowingCount(uid, callback) {
	const ref = db.ref(`/people/${uid}/following`);
	const cb = ref.on('value', data => callback(data.numChildren()));
	return {cb, ref};

}

// Starts tracking the "Follow" button status.
function registerToFollowStatusUpdate(currentUserId, uid, callback) {
	const ref = db.ref(`/people/${currentUserId}/following/${uid}`);
	ref.on('value', callback);
}

export function trackFollowStatus(uid, callback) {
	const auth = getAuth();
	if (auth.currentUser) {
		registerToFollowStatusUpdate(auth.currentUser.uid, uid, callback);
	}
}

export function updateFollow(currentUserUid, followeeUid, val) {
	toggleFollowUser(currentUserUid, followeeUid, val);
}

/**
 * Saves public user data to the database after signup
 */
export function saveUserData(uid, userName, displayName, imageUrl) {
	let searchFullName = displayName.toLowerCase();
	let searchReversedFullName = searchFullName.split(' ').reverse().join(' ');
	try {
		searchFullName = latinize(searchFullName);
		searchReversedFullName = latinize(searchReversedFullName);
	} catch(e) {
		console.error(e);
	}
	const userInfo = {
		profile_picture: imageUrl,
		username: userName,
		full_name: displayName,
		_search_index: {
			full_name: searchFullName,
			reversed_full_name: searchReversedFullName
		}
	};
	return base.initializedApp.database().ref(`people/${uid}`).update(userInfo);
}

// TODO: deleteUserData
