import { signInWithEmailAndPassword, getAuth, signUserOut } from '../utils/auth';
import { getUsername } from '../utils/index';
import * as types from '../constants/actionTypes.js'

export const login = (email, password) => dispatch => (
  signInWithEmailAndPassword(email, password).then(
    ({uid, email}) => {
      getUsername(uid).then((snapshot) => {
        const username = snapshot.val();
        const loggedInUser = { username, uid , email }
        dispatch(receiveCurrentUser(loggedInUser))
      });
    },
    errors => dispatch(receiveSessionErrors(errors))
  )
);

export const fetchCurrentUser = (email, uid) => dispatch => {
  dispatch(beginUserFetch());
  return getUsername(uid).then((snapshot) => {
    const username = snapshot.val();
    const loggedInUser = { username, uid , email }
    dispatch(receiveCurrentUser(loggedInUser))
  })
};

export const logOut = () => dispatch => (
  signUserOut().then(() => dispatch(clearCurrentUser()))
);

export const receiveCurrentUser = currentUser => ({
  type: types.RECEIVE_CURRENT_USER,
  currentUser
});

export const clearCurrentUser = () => ({
  type: types.CLEAR_CURRENT_USER
});

export const beginUserFetch = () => ({
  type: types.BEGIN_USER_INFO_FETCH
});
