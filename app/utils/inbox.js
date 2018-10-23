import firebase from 'firebase';
import base from './rebase';
import { Link } from 'react-router-dom';
import { getPaginatedFeed, toArray } from './index';
import * as NotificationTypes from '../constants/notificationTypes';

let db = base.initializedApp.database();

export function addUserNotification(notifiedUid, notifier, notificationType, postId) {
	console.log(notifiedUid, notifier, notificationType, postId);
	if (NotificationTypes.ALL_NOTIFICATION_TYPES.includes(notificationType)) {
		const ref = db.ref(`/notifications/${notifiedUid}`);
		const timestamp = firebase.database.ServerValue.TIMESTAMP;
		const notification = {
			username: notifier.username,
			uid: notifier.uid,
			type: notificationType,
			postId: postId,
			timestamp: timestamp,
			read: false
		}
		return ref.push(notification);
	}
}

export function getUserNotifications(currentUserUid) {
	const NOTIFICATION_PAGE_SIZE = 10;
	const ref = `/notifications/${currentUserUid}`;
	return getPaginatedFeed(ref, NOTIFICATION_PAGE_SIZE, null, false);
}

export function markNotificationAsRead(userId, notificationId) {
	return db.ref(`/notifications/${userId}/${notificationId}/read`).set(true);
}

export function removeNotification(userId, notificationId) {
	return db.ref(`/notifications/${userId}/${notificationId}`).set(null);
}
