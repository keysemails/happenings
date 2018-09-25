import { loadUserByUsername } from '../utils/user';
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
  testUtil(query).then(
    (users) => dispatch(receiveSearchedUsers(users))
  )
)

export const receiveSearchedUsers = users => ({
  type: types.RECEIVE_SEARCHED_USERS,
  users
});

// export const testUtil = (query) => {
//   console.log(query)
//   return {uid1: { username: 'egg' }, uid2: {username: 'duck'} }
// }

export const testUtil = query => (
  new Promise((resolve, reject) => {
    console.log(query)
    resolve({uid1: { username: 'egg' }, uid2: {username: 'duck'} })
  })
)
