import * as types from '../constants/actionTypes.js';

const defaultSession = {
  currentUser: null,
  proceedWithoutLogin: false
};

const sessionReducer = (state = defaultSession, action) => {
  switch(action.type) {
    case types.RECEIVE_CURRENT_USER:
      return { ...state, currentUser: action.currentUser };
    case types.CLEAR_CURRENT_USER:
      return defaultSession;
     case types.PROCEED_WITHOUT_USER_LOGIN:
       return { ...state, proceedWithoutLogin: true }
    default:
      return state;
  }
};

export default sessionReducer;
