import * as types from '../constants/actionTypes.js';

const postsReducer = (state = {}, action) => {
  switch(action.type){
    case types.RECEIVE_POSTS:
    // TODO normalize state and put authors in user slice of state
      return action.posts;
    default:
      return state;
  }
};

export default postsReducer;
