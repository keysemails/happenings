import * as types from '../constants/actionTypes.js';

const addId = (posts) => {
  Object.keys(posts).map(id => posts[id].id = id )
  return posts
}

const postsReducer = (state = {}, action) => {
  switch(action.type) {
    case types.RECEIVE_FEED_PAGE:
    // TODO normalize state and put authors in user slice of state
      return { ...state, ...addId(action.posts) }
    case types.RECEIVE_SEARCHED_POSTS:
      return { ...state, ...addId(action.posts) }
    case types.RECEIVE_INBOX_EVENTS:
      return { ...state, ...addId(action.posts) }
    case types.RECEIVE_POST_DATA:
      return {...state, ...action.post}
    default:
      return state;
  }
};

export default postsReducer;
