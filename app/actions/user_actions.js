import {
  loadUserByUsername, searchByUsername, updateFollowStatus, getAuthorByPostId
} from '../utils/user';
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

export const searchUsers = (query) => dispatch => (
  searchByUsername(query).then( snapshot => {
    let users = snapshot.val()
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

export const updateFollowVal = (followeeUid, val) => ({
  type: types.UPDATE_FOLLOW_VAL,
  followeeUid,
  val
});

export const updateFollow = (currUser, followeeUid, val) => dispatch => (
  updateFollowStatus(currUser, followeeUid, val).then(() => {
    dispatch(updateFollowVal(followeeUid, val));
  })
);

export const followPostAuthor = (currUser, postId, val) => dispatch => (
  getAuthorByPostId(postId).then(
    res => res.val()
  ).then(
    author => updateFollowStatus(currUser, author.uid, true)
  )
);
