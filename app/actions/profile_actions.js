import { TIMELINE_FEED_TYPES } from '../constants';
import { getUserHostedPosts, getFeedPostData } from '../utils/feed';
import { getUpcomingEvents } from '../utils/timeline'
import { receiveFeedData } from './post_actions';

export const getHostedPosts = (uid) => dispatch => (
    getUserHostedPosts(uid).then(data => {
      console.log(data);
      dispatch(receiveFeedData(data))
    })
);

export const getAttendingPosts = (uid) => dispatch => (
  getUpcomingEvents(uid).then(data => {
    console.log(data);
    dispatch(receiveFeedData(data));
  })
);

export const getStarredPosts = (uid) => dispatch => (
  console.log('not implemented yet')
);

export const getTimelinePosts = (uid, feedType) => dispatch => {
  switch(feedType) {
    case TIMELINE_FEED_TYPES.HOST:
      return dispatch(getHostedPosts(uid));
    case TIMELINE_FEED_TYPES.ATTENDING:
      return dispatch(getAttendingPosts(uid));
    case TIMELINE_FEED_TYPES.STARRED:
      return dispatch(getStarredPosts(uid));
  }
}
