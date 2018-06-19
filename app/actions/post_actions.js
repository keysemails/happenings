import * as FeedUtil from '../utils/feed';
import * as types from '../constants/actionTypes.js'

export const getUserPosts = (uid) => dispatch => (
    FeedUtil.getUserFeedPosts(uid).then(data => {
      dispatch(receivePosts(data))
    })
);

export const getMainFeed = (uid) => dispatch => {
  dispatch(startLoadingPosts());
  return FeedUtil.updateMainFeed(uid).then(() => {
    FeedUtil.getMainFeedPosts(uid).then((data) => {
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
