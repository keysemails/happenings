import firebase from 'firebase';
import base from './rebase';
import { getPaginatedFeed, subscribeToFeed, getUsername } from './index';
import { recordUserActivity } from './discover';
import { addUserNotification } from './inbox';
import { getAuth } from './auth';
import { PAGE_SIZES } from '../constants';
import { USER_ATTENDING, USER_COMMENTED } from '../constants/notificationTypes';

/**
 * Functions for handling all things related to an individual post
 */

// firebase crap, extremely not good
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
  const ref = db.ref(`/stars_post/${postId}/${auth.currentUser.uid}`);
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
  const ref = db.ref(`/stars_post/${postId}`);
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
export function updateLike(currentUser, postId, event_timestamp, value) {
  // only record activity when the user likes a post, not if unlike
  if (value === true) {
    recordUserActivity(currentUser, postId, event_timestamp, 'like');
  }
  const updates = {};
  const starVal = value ? firebase.database.ServerValue.TIMESTAMP : null;
  updates [`/stars_post/${postId}/${currentUser.uid}`] = starVal;

  // put the event_timestamp as the value to the postId key so we can
  // easily query stars_user by an event_timestamp range
  updates[`/stars_user/${currentUser.uid}/${postId}`] = event_timestamp;
  return db.ref().update(updates);
}


// organized by user then by post to more easily get 'all events a user is attending'
export function updateAttending(currentUser, postId, authorUid, event_timestamp, value) {
  if (event_timestamp > Date.now()) {
    if (value) {
      recordUserActivity(currentUser, postId, event_timestamp, 'attend');
      addUserNotification(authorUid, currentUser, USER_ATTENDING, postId);
    }
    // we are passing in event_timestamp from the post component so the DB has less work to do
    const attendVal = value ? event_timestamp : null;
    const updates = {};
    updates[`/attends_user/${auth.currentUser.uid}/${postId}`] = attendVal;
    updates[`/attends_post/${postId}/${auth.currentUser.uid}`] = attendVal;
    return db.ref().update(updates);
  } else {
    console.error('attending past events currently unsupported :)');
  }
}

/**
 *  addComment does the following:
 *   1 - inserts a comment to the comments DB table
 *   2 - records the commenting user's activity (for DiscoverFeed)
 *   3 - notifies the post author that <user> commented on their <post>
 *
 * @param {object} currentUser     object containing a username and UID
 * @param {string} postId
 * @param {string} authorUid       UID of author
 * @param {integer} event_timestamp for recordUserActivity
 * @param {string} text            comment body
 */
export function addComment(currentUser, postId, authorUid, event_timestamp, text) {
  const comment = {
    text: text,
    timestamp: Date.now(),
    author: {
      uid: currentUser.uid,
      username: currentUser.username
    }
  };
  return db.ref(`/comments/${postId}`).push(comment).then(res => {
    recordUserActivity(currentUser, postId, event_timestamp, 'comment');
    addUserNotification(authorUid, currentUser, USER_COMMENTED, postId);
  });
}


export function deleteComment(postId, commentId) {
  return db.ref(`/comments/${postId}/${commentId}`).set(null);
}


export function deletePost(postId, picStorageUri, thumbStorageUri) {
  return db.ref(`/attends_post/${postId}`).once('value', affiliatedUsers => {
    const peopleGoing = affiliatedUsers.val();
    const updates = {};
    updates[`/people/${auth.currentUser.uid}/posts/${postId}`] = null;
    updates[`/comments/${postId}`] = null;
    updates[`/stars_post/${postId}`] = null;
    updates[`/posts/${postId}`] = null;
    updates[`/feed/${auth.currentUser.uid}/${postId}`] = null;
    updates[`/attends_post/${postId}`] = null;

    if (peopleGoing) {
      Object.keys(peopleGoing).forEach(userId => {
        // TODO: maybe send some kind of notification to let them know its cancelled
        updates[`/attends_user/${userId}/${postId}`] = null;
      });
    }
    return db.ref().update(updates);
  })
}


export function searchByTitle(query) {
  return db.ref('/posts/').orderByChild('title')
    .startAt(query)
    .endAt(query+"\uf8ff").once('value');
}
