import _ from 'underscore';
import * as InboxUtil from '../utils/inbox';
import * as types from '../constants/actionTypes.js';
import { ALL_NOTIFICATION_TYPES } from '../constants/notificationTypes.js';
import { getPostData, updateAttending } from '../utils/post';


export const getUserNotifications = (uid) => dispatch => {
	dispatch(beginNotificationFetch());
	return InboxUtil.getUserNotifications(uid).then(data => {
		dispatch(receiveNotificationData(data));
	});
};

export const beginNotificationFetch = () => ({
	type: types.BEGIN_NOTIFICATION_FETCH
 });

export const beginInboxFetch = () => ({
	type: types.BEGIN_INBOX_FETCH
});

export const receiveNotificationData = (data) => ({
	type: types.RECEIVE_NOTIFICATION_PAGE,
	notifications: data.entries,
	nextPage: data.nextPage
});

export const getNotificationEventData = (notifications) => dispatch => {
	dispatch(beginInboxFetch());
	// can have multiple notifications on a given event.
	// only fetch the bare minimum amt of data we need.
	// also, only some notifications have postIds.
	const uniquePostIds = _.uniq(_.pluck(notifications, 'postId')).filter(id => !!id);
	const queries = uniquePostIds.map(postId => {
		return getPostData(postId).then(data => {
			return {
				...data.val(), postId
			}
		});
	});
	return Promise.all(queries).then(results => {
		let stateSlice = {};
		results.forEach(result => {
			stateSlice[result.postId] = result
		});
		dispatch(receiveInboxData(stateSlice))
	});
};

export const receiveInboxData = (data) => ({
	type: types.RECEIVE_INBOX_EVENTS,
	posts: data
})

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

export const removeNotification = (userId, notificationId) => dispatch => {
	console.log('here it goes with deletion');
	InboxUtil.removeNotification(userId, notificationId).then(res => {
		dispatch(getUserNotifications(userId));
	});
}
