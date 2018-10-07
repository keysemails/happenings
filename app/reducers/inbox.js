import * as types from '../constants/actionTypes.js';

const notificationReducer = (state = {}, action) => {
	switch(action.type) {
		case types.MARK_NOTIFICATION_AS_READ:
			return {...state, read: true}
		default:
			return state;
	}
}

const notificationsReducer = (state = {}, action) => {
	switch(action.type) {
		case types.RECEIVE_NOTIFICATION_PAGE:
			return action.notifications
		case types.MARK_NOTIFICATION_AS_READ:
			return {
				...state,
				[action.id]: notificationReducer(state[action.id], action)
			}
		default:
			return state
	}
}

const inboxReducer = (state = {}, action) => {
	switch(action.type) {
		case types.RECEIVE_NOTIFICATION_PAGE:
			return {
				...state,
				notifications: notificationsReducer(state.notifications, action)
			}
		case types.MARK_NOTIFICATION_AS_READ:
			return {
				...state,
				notifications: notificationsReducer(state.notifications, action)
			}
		case types.SET_UNREAD_NOTIFICATION_COUNT:
			return {
				...state,
				unreadNotifications: action.count
			}
		default:
			return state;
	}
};

export default inboxReducer;