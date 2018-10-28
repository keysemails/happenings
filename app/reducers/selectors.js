export const selectAuthoredPosts = (state, authorName) => {
  const res = {};
  const posts = state.entities.users[authorName].posts;

  if (posts) {
    for (let i = 0; i < posts.length; i++) {
      const post = state.entities.posts[posts[i]];
      if (post) {
        res[posts[i]] = (post);
      }
    }
  }

  return res;
}

export const isUserAttendee = (state, postId) => {
  if (state.listeners.attendees[postId]) {
    const uid = state.session.currentUser.uid
    return Object.keys(state.listeners.attendees[postId].items).includes(uid);
  }
  return false;
}

export const isUserLiker = (state, ownProps) => {
  if (state.listeners.likers[ownProps.id]) {
    const uid = state.session.currentUser.uid
    return Object.keys(state.listeners.likers[ownProps.id].items).includes(uid);
  }
  return false;
}

export const selectOpenModal = (state) => {
  let retVal = false;
  Object.keys(state.ui.modals).forEach(key => {
    // modals[key] is either a stringtype (postId) or boolean (false)
    if (!!state.ui.modals[key]) {
      retVal = key;
    }
  });
  return retVal;
}

export const selectUserResults = state => (
  state.ui.search.userIds.map(userId => (
    state.entities.users[userId]
  ))
)

export const selectPostResults = state => (
  state.ui.search.postIds.map(postId => (
    state.entities.posts[postId]
  ))
)

export const countUnreadNotifications = state => {
  if (state.session.currentUser) {
    var count = Object.keys(state.entities.inbox.notifications).filter(
      notification => state.entities.inbox.notifications[notification].read == false
      ).length;
    return count ? count : 0;
  }
}
