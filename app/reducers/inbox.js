import * as types from '../constants/actionTypes.js';

const notificationReducer = (state = {}, action) => {
	switch(action.type) {
		case types.MARK_NOTIFICATION_AS_READ:
			return { ...state, read: true }
		default:
			return state;
	}
}

const inboxReducer = (state = {}, action) => {
	switch(action.type) {
		case types.RECEIVE_NOTIFICATION_PAGE:
			return action.notifications
		case types.MARK_NOTIFICATION_AS_READ:
			return {
				...state,
				[action.notificationId]: notificationReducer(
					state[action.notificationId], action
				)
			}
		default:
			return state;
	}
};

export default inboxReducer;