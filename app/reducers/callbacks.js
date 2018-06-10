import * as types from '../constants/actionTypes.js';

const callbacksReducer = (state = {}, action) => {
  Object.freeze(state);
  switch(action.type){
    case types.RECEIVE_POSTS:
      return { ...state, nextFeedPage: action.nextPage };
    default:
      return state;
  }
};

export default callbacksReducer;
