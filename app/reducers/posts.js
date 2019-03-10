import * as types from '../constants/actionTypes.js';

const addPostId = (posts) => {
  Object.keys(posts).map(id => posts[id].id = id )
  return posts
}

const postsReducer = (state = {}, action) => {
  switch(action.type) {
    case types.BEGIN_PAGE_FETCH:
      return {}
    case types.RECEIVE_FEED_PAGE:
    // TODO normalize state and put authors in user slice of state
      return { ...state, ...addPostId(action.posts) }
    case types.RECEIVE_SEARCHED_POSTS:
      return { ...state, ...addPostId(action.posts) }
    case types.RECEIVE_INBOX_EVENTS:
      return { ...state, ...addPostId(action.posts) }
    case types.RECEIVE_POST_DATA:
      return {...state, ...action.post}
    default:
      return state;
  }
};

export default postsReducer;
