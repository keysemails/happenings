import base from './rebase';
import { getPaginatedFeed } from './index';

export function getUserNotifications(currentUserUid) {
	const ref = db.ref(`/notifications/${currentUserUid}`);
}

export function markNotificationAsRead(userId, notificationId) {

}

export function removeNotification(userId, notificationId) {

}

