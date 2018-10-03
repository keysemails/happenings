import { loadUserByUsername, searchByUsername } from '../utils/user';
import { getUsername } from '../utils/index';
import * as types from '../constants/actionTypes.js'

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

export const searchUsers = (query) => dispatch => (
  searchByUsername(query).then( snapshot => {
    let users = snapshot.val()
    console.log(users)
    if (!users || !query) {
      users = {}
    }
    dispatch(receiveSearchedUsers(users))
  })
);

export const receiveSearchedUsers = users => ({
  type: types.RECEIVE_SEARCHED_USERS,
  users
});
