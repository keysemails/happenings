import * as InboxUtil from '../utils/inbox';
import * as types from '../constants/actionTypes.js';
import { ALL_NOTIFICATION_TYPES } from '../constants/notificationTypes.js';

export const getUserNotifications = (uid) => dispatch => {
	dispatch(beginNotificationFetch());
	return InboxUtil.getUserNotifications(uid).then(data => {
		dispatch(receiveNotificationData(data));
	});
};

export const beginNotificationFetch = () => ({
	type: types.BEGIN_NOTIFICATION_FETCH
 });

export const receiveNotificationData = (data) => ({
	type: types.RECEIVE_NOTIFICATION_PAGE,
	notifications: data.entries,
	nextPage: data.nextPage
});

export const readNotification = (id) => ({
	type: types.MARK_NOTIFICATION_AS_READ,
	id: id
});

export const setUnreadNotifications = (count) => ({
	type: types.SET_UNREAD_NOTIFICATION_COUNT,
	count
});

export const markAsRead = (currUserUid, notificationId) => dispatch => {
	InboxUtil.markNotificationAsRead(currUserUid, notificationId).then(res => {
		dispatch(readNotification(notificationId));
	});
};
