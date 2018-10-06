import * as InboxUtil from '../utils/inbox';
import * as types from '../constants/actionTypes.js';
import { ALL_NOTIFICATION_TYPES } from '../constants/notificationTypes.js';

export const getUserNotifications = (uid) => dispatch => {
	console.log('getting notifications for ', uid);
	dispatch(beginNotificationFetch());
	InboxUtil.getUserNotifications(uid).then(data => {
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

