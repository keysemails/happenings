import * as types from '../constants/actionTypes.js';

const INITIAL_STATE = {
  inboxLoading: false,
  notificationsLoading: false,
  userLoading: false,

  inboxLoaded: false,
  notificationsLoaded: false,
  userLoaded: false
};
const loadingReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.BEGIN_PAGE_FETCH:
      return { ...state, postsLoading: true };
    case types.BEGIN_USER_INFO_FETCH:
      return {...state, userLoading: true };
    case types.BEGIN_NOTIFICATION_FETCH:
      return { ...state, notificationsLoading: true };
    case types.BEGIN_INBOX_FETCH:
      return {...state, inboxLoading: true };
    case types.RECEIVE_FEED_PAGE:
      return { ...state, postsLoading: false };
    case types.RECEIVE_NOTIFICATION_PAGE:
      return {
        ...state,
        notificationsLoading: false,
        notificationsLoaded: true
      };
    case types.RECEIVE_INBOX_EVENTS:
      return {
        ...state,
        inboxLoading: false,
        inboxLoaded: true
      };
    case types.RECEIVE_CURRENT_USER:
      return {
        ...state,
        userLoading: false,
        userLoaded: true
      };
    default:
      return state;
  }
};

export default loadingReducer;
