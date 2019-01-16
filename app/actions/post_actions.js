import * as FeedUtil from '../utils/feed';
import * as DiscoverUtil from '../utils/discover';
import * as PostUtil from '../utils/post';
import * as types from '../constants/actionTypes.js';

import { fillFormData } from './form_actions';
import * as UploadUtil from '../utils/upload';

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
  PostUtil.searchByTitle(query).then(snapshot => {
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
});

export const beginPostFetch = () => ({
  type: types.BEGIN_PAGE_FETCH
});

export const receivePostData = (post) => ({
  type: types.RECEIVE_POST_DATA,
  post
});

/**
 * @param  {string} postID
 * @return {[]}
 *
 * Called when the Edit Event page is opened for an existing event
 */
export const getPostData = (postID) => (dispatch) => {
  dispatch(beginPostFetch());
  PostUtil.getPostData(postID)
    .then(snap => snap.val())
    // TODO need redux thunk-y 404 handling here
    // the 404 action should clear out the store and go to a 404 page
    .then(post => ({[postID]: post}))
    .then(post => dispatch(receivePostData(post)))
    .then(() => dispatch(fillFormData(postID)));
};

export const beginEventUpload = () => ({
  type: types.BEGIN_EVENT_UPLOAD
});

export const eventUploadCompleted = () => ({
  type: types.COMPLETE_EVENT_UPLOAD
});

/**
 * @param  {object} currentUser - the currentUser in the store
 * @param { object } history - the history prop from React Router
 */
export const uploadEventData = (currentUser, history) => (dispatch, getState) => {
  dispatch(beginEventUpload());
  const store = getState();
  const eventData = store.ui.form.fields;
  const localImage = store.ui.form.localImage;

  UploadUtil.uploadEventData(currentUser, eventData, localImage, (response) => {
    if (response.status == 'SUCCESS') {
      dispatch(eventUploadCompleted());
      const newPostID = response.message;
      // redirect to event page
      history.push(`/event/${newPostID}`);
    } else {
      console.error(response.message);
    }
  });
}

export const updateEventData = (currentUser, postID, history) => (dispatch, getState) => {
  const store = getState();
  const oldEventData = store.entities.posts[postID];
  const newEventData = store.ui.form.fields;
  const localImage = store.ui.form.localImage;

  UploadUtil.updateEventData(currentUser, postID, oldEventData, newEventData, localImage, (response) => {
    if (response.status == 'SUCCESS') {
      history.push(`/event/${response.message}`);
    } else {
      console.error(response.message);
    }
  });
}
