import { TIMELINE_FEED_TYPES } from '../constants';
import { getUserHostedPosts, getFeedPostData } from '../utils/feed';
import { getUpcomingAttending, getUpcomingStarred } from '../utils/timeline'
import { beginPostFetch, receiveFeedData } from './post_actions';

export const getHostedPosts = (uid) => dispatch => {
    dispatch(beginPostFetch());
    getUserHostedPosts(uid).then(data => {
      dispatch(receiveFeedData(data))
    })
};

export const getAttendingPosts = (uid) => dispatch => {
  dispatch(beginPostFetch());
  getUpcomingAttending(uid).then(data => {
    dispatch(receiveFeedData(data));
  })
};

export const getStarredPosts = (uid) => dispatch => {
  dispatch(beginPostFetch());
  getUpcomingStarred(uid).then(data => {
    dispatch(receiveFeedData(data));
  })
};

export const getTimelinePosts = (uid, feedType) => {
  switch(feedType) {
    case TIMELINE_FEED_TYPES.HOST:
      return getHostedPosts(uid);
    case TIMELINE_FEED_TYPES.ATTENDING:
      return getAttendingPosts(uid);
    case TIMELINE_FEED_TYPES.STARRED:
      return getStarredPosts(uid);
  }
}
