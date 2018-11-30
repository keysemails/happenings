import * as types from '../constants/actionTypes.js';

const notificationReducer = (state = {}, action) => {
  switch(action.type) {
    case types.RECEIVE_NOTIFICATION_PAGE:
      return action.notifications;

    case types.MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        [action.id]: {...state[action.id], read: true}
      }
    default:
      return state;
  }
};

export default notificationReducer;
