import firebase from 'firebase';
import base from './rebase';
import { getPaginatedFeed, toArray } from './index';
import { ALL_NOTIFICATION_TYPES } from '../constants/notificationTypes';

let db = base.initializedApp.database();

export function addUserNotification(uid, notifier, notificationType, postId) {
	const ref = db.ref(`/notifications/${uid}`);
	if (ALL_NOTIFICATION_TYPES.includes(notificationType)) {
		const notification = {
			username: notifier.username,
			uid: notifier.uid,
			type: notificationType,
			postId: postId,
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
