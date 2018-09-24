import { merge } from 'lodash';

import * as types from '../constants/actionTypes.js';

// import { RECEIVE_SEARCHED_USERS } from '../actions/user_actions';
// import { RECEIVE_SEARCHED_POSTS } from '../actions/post_actions';
// import { CLEAR_SEARCH } from '../actions/ui_actions';

const defaultState = {
  userIds: [],
  postIds: []
};

const searchResultsReducer = (state = defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_SEARCHED_USERS:
      return Object.assign({}, state, { userIds: Object.keys(action.users) });
    case RECEIVE_SEARCHED_POSTS:
      return Object.assign({}, state, { postIds: Object.keys(action.posts) });
    case CLEAR_SEARCH:
      return defaultState;
    default:
      return state;
  }
};

export default searchResultsReducer;
