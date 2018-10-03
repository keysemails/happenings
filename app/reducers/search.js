import * as types from '../constants/actionTypes.js';

const defaultState = {
  searchedEntity: 'users',
  userIds: [],
  postIds: []
};

const searchResultsReducer = (state = defaultState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case types.RECEIVE_SEARCHED_USERS:
      return { ...state, userIds: Object.keys(action.users) };
    case types.RECEIVE_SEARCHED_POSTS:
      return { ...state, postIds: Object.keys(action.posts) };
    case types.UPDATE_SEARCHED_ENTITY:
      return { ...state, searchedEntity: action.searchedEntity };
    case types.CLEAR_SEARCH:
      return defaultState;
    default:
      return state;
  }
};

export default searchResultsReducer;
