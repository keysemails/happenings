import { loadUserByUsername } from '../utils/user';
import { getUsername } from '../utils/index';
import * as types from '../constants/actionTypes.js';

export const fetchUserByUsername = (username) => dispatch => (
  loadUserByUsername(username).then(snapshot => {
    const userInfo = snapshot.val();
    dispatch(receiveUser(userInfo));
  })
);

export const receiveUser = user => ({
  type: types.RECEIVE_USER,
  user
});
