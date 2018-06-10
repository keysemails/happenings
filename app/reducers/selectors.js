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
