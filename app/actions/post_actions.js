import * as feedUtil from '../utils/feed';
import * as types from '../constants/actionTypes.js'

export const getUserPosts = (uid) => dispatch => (
    feedUtil.getUserFeedPosts(uid).then(data => {
      dispatch(receivePosts(data))
    })
);

export const getMainFeed = (uid) => dispatch => {
  dispatch(startLoadingPosts());
  return feedUtil.updateMainFeed(uid).then(() => {
    feedUtil.getMainFeedPosts(uid).then((data) => {
      dispatch(receivePosts(data))
    })
  })
};

export const updateFeed = () => ({
  type: type.FEED_UPDATED
});

export const receivePosts = (data) => ({
  type: types.RECEIVE_POSTS,
  posts: data.entries,
  nextPage: data.nextPage
});

export const startLoadingPosts = () => ({
  type: types.BEGIN_POSTS_FETCH
});
