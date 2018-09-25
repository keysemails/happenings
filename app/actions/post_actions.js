import * as FeedUtil from '../utils/feed';
import * as DiscoverUtil from '../utils/discover';
import * as types from '../constants/actionTypes.js'

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
  type: type.FEED_UPDATED
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
  testUtil(query).then(
    (posts) => dispatch(receiveSearchedPosts(posts))
  )
)

export const receiveSearchedPosts = posts => ({
  type: types.RECEIVE_SEARCHED_POSTS,
  posts
})

export const testUtil = query => (
  new Promise((resolve, reject) => {
    console.log(query)
    resolve({postid1: { title: 'egg' }, posti2: {title: 'duck'} })
  })
)
