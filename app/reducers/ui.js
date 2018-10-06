import * as types from '../constants/actionTypes.js';
import modalsReducer from './modals';

const INITIAL_UI_STATE = {
  modals: {
    postOptionsModal: false,
    authorOptionsModal: false
  }
};

const uiReducer = (state = INITIAL_UI_STATE, action) => {
  switch(action.type){
    case types.BEGIN_PAGE_FETCH:
      return { ...state, postsLoading: true };
    case types.RECEIVE_FEED_PAGE:
      return { ...state, postsLoading: false };
    case types.OPEN_MODAL:
      return {
        ...state, modals: modalsReducer(state.modals, action)
      };
    case types.CLOSE_MODAL:
      return {
        ...state, modals: modalsReducer(state.modals, action)
      }
    default:
      return state;
  }
};

export default uiReducer;
