import * as types from '../constants/actionTypes.js';

const postsReducer = (state = {}, action) => {
  switch(action.type) {
    case types.RECEIVE_FEED_PAGE:
    // TODO normalize state and put authors in user slice of state
      return action.posts;
    case types.RECEIVE_SEARCHED_POSTS:
      return { ...state, ...action.posts }
    default:
      return state;
  }
};

export default postsReducer;
