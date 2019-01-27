import * as types from '../constants/actionTypes.js';

const INITIAL_UI_STATE = {
  postOptionsModal: false,
  authorOptionsModal: false
};

const modalsReducer = (state = INITIAL_UI_STATE, action) => {
  switch(action.type) {
    case types.OPEN_MODAL:
      return {
        ...state, [action.modalName]: action.value
      };
    case types.CLOSE_MODAL:
      return {
        ...state, [action.modalName]: false
      };
    default:
      return state;
  }
};

export default modalsReducer;