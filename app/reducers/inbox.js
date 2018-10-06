import * as types from '../constants/actionTypes.js';

const inboxReducer = (state = {}, action) => {
	switch(action.type) {
		case types.RECEIVE_NOTIFICATION_PAGE:
			return action.notifications
		default:
			return state;
	}
};

export default inboxReducer;