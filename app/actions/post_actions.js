import * as FeedUtil from '../utils/feed';
import * as DiscoverUtil from '../utils/discover';
import * as types from '../constants/actionTypes.js'
import { searchByTitle } from '../utils/post';

export const getUserPosts = (uid) => dispatch => (
    FeedUtil.getUserFeedPosts(uid).then(data => {
      dispatch(receiveFeedData(data))
    })
);

export const getMainFeed = (uid) => dispatch => {
  dispatch(startLoadingPosts());
  return FeedUtil.updateMainFeed(uid).then(() => {
    FeedUtil.getMainFeedPosts(uid).then((data) => {
      dispatch(receiveFeedData(data))
    })
  })
};

export const getDiscoverFeed = (uid) => dispatch => {
  dispatch(startLoadingPosts());
  return DiscoverUtil.updateDiscoverFeed(uid).then(() => {
    DiscoverUtil.getDiscoverFeedPosts(uid).then((data) => {
      dispatch(receiveFeedData(data))
    })
  })
};

export const updateFeed = () => ({
  type: types.FEED_UPDATED
});

export const receiveFeedData = (data) => ({
  type: types.RECEIVE_FEED_PAGE,
  posts: data.entries,
  nextPage: data.nextPage
});

export const startLoadingPosts = () => ({
  type: types.BEGIN_PAGE_FETCH
});

export const receiveDiscoverFeedData = (data) => ({
  type: types.RECEIVE_DISCOVER_FEED_PAGE,
  discoverInfo: data.entries,
  nextPage: data.nextPage
})

export const searchPosts = (query) => dispatch => (
  searchByTitle(query).then(snapshot => {
    let posts = snapshot.val()
    if (!posts || !query) {
      posts = {}
    }
    dispatch(receiveSearchedPosts(posts))
  })
);

export const receiveSearchedPosts = posts => ({
  type: types.RECEIVE_SEARCHED_POSTS,
  posts
})
