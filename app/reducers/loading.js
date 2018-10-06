import * as types from '../constants/actionTypes.js';

const INITIAL_STATE = {};
const loadingReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.BEGIN_PAGE_FETCH:
      return { ...state, postsLoading: true };
    case types.RECEIVE_FEED_PAGE:
      return { ...state, postsLoading: false };
    case types.BEGIN_NOTIFICATION_FETCH:
      return { ...state, notificationsLoading: true };
    case types.RECEIVE_NOTIFICATION_PAGE:
      return { ...state, notificationsLoading: false };
    default:
      return state;
  }
};

export default loadingReducer;
