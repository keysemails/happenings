import firebase from 'firebase';
import base from './rebase';
import { getPaginatedFeed, subscribeToFeed, getUsername } from './index';
import { getAuth } from './auth';
import { PAGE_SIZES } from '../constants';

/**
 * Functions for handling all things related to an individual post
 */

const COMMENTS_PAGE_SIZE = 3;

// firebase crap
let db = base.initializedApp.database();
let auth = getAuth();

 export function fetchComments(postId) {
 	return getPaginatedFeed(`/comments/${postId}`, PAGE_SIZES.COMMENTS, null, false);
 }

 export function subscribeToComments(postId, latestCommentId, callback) {
 	return subscribeToFeed(`/comments/${postId}`, callback, latestCommentId, false);
 }

 /**
  * determine if the current user has liked a given post
  */
export function registerUserToLike(postId, callback) {
	const ref = db.ref(`/likes/${postId}/${auth.currentUser.uid}`);
	ref.on('value', data => callback(!!data.val()));
}

export function registerUserAttendance(postId, callback) {
	const ref = db.ref(`/attends_post/${postId}/${auth.currentUser.uid}`);
	ref.on('value', data => callback(!!data.val()));
}

/**
 * gets post data such as image and caption
 */
export function getPostData(postId) {
	return db.ref(`/posts/${postId}`).once('value');
}

/**
 * Listens to updates on the likes of a post and calls the callback with likes counts.
 * TODO: This won't scale if a user has a huge amount of likes. We need to keep track of a
 *       likes count instead.
 */
export function registerForLikesCount(postId, callback) {
	const ref = db.ref(`/likes/${postId}`);
	ref.on('value', data => callback(data.numChildren()));
}

/**
 * probably won't scale either..
 */
export function registerForCommentsCount(postId, callback) {
	const ref = db.ref(`/comments/${postId}`);
	ref.on('value', data => callback(data.numChildren()));
}

export function registerForAttendingCount(postId, callback) {
	const ref = db.ref(`/attends_post/${postId}`);
	ref.on('value', data => callback(data.numChildren()));
}

/**
 * Updates the like status of a post from the current user.
 */
export function updateLike(postId, value) {
	console.log(postId, value);
	return db.ref(`/likes/${postId}/${auth.currentUser.uid}`).set(
		value ? firebase.database.ServerValue.TIMESTAMP : null
	);
}

// organized by user then by post to more easily get 'all events a user is attending'
export function updateAttending(postId, event_timestamp, value) {
	console.log(postId, event_timestamp, value);
	// we are passing in event_timestamp from the post component so the DB has less work to do
	const attendVal = value ? event_timestamp : null;
	const updates = {};
	updates[`/attends_user/${auth.currentUser.uid}/${postId}`] = attendVal;
	updates[`/attends_post/${postId}/${auth.currentUser.uid}`] = attendVal;
	return db.ref().update(updates);
}

export function addComment(currentUser, postId, text) {
	// :param currentUser comes from the Redux store
	const comment = {
		text: text,
		timestamp: Date.now(),
		author: {
			uid: currentUser.uid,
			username: currentUser.username
		}
	};
	return db.ref(`/comments/${postId}`).push(comment);
}

export function deleteComment(postId, commentId) {
	console.log('deleting', postId, commentId);
	return db.ref(`/comments/${postId}/${commentId}`).set(null);
}

export function deletePost(postId, picStorageUri, thumbStorageUri) {
	return db.ref(`/attends_post/${postId}`).once('value', affiliatedUsers => {
		const updates = {};
		updates[`/people/${auth.currentUser.uid}/posts/${postId}`] = null;
		updates[`/comments/${postId}`] = null;
		updates[`/likes/${postId}`] = null;
		updates[`/posts/${postId}`] = null;
		updates[`/feed/${auth.currentUser.uid}/${postId}`] = null;
		updates[`/attends_post/${postId}`] = null;

		// for all users attending, clear this post from the events they are attending
		Object.keys(affiliatedUsers.val()).forEach(userId => {
			// TODO: maybe send some kind of notification to let them know its cancelled
			updates[`/attends_user/${userId}/${postId}`] = null;
		});
		return db.ref().update(updates);
	})
}