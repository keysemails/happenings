import * as types from '../constants/actionTypes.js';

const uiReducer = (state = {}, action) => {
  Object.freeze(state);
  switch(action.type){
    case types.BEGIN_PAGE_FETCH:
      return { ...state, postsLoading: true };
    case types.RECEIVE_FEED_PAGE:
      return { ...state, postsLoading: false };
    default:
      return state;
  }
};

export default uiReducer;
