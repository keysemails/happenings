const getPost = require('../queries/posts').getPost;
const lookupUser = require('../queries/users').getUserByUid;

module.exports = (router) => {
  router.param('post_id', (req, res, next, postId) => {
    getPost(postId).then(result => {
      if (result.length === 0) {
        return res.status(404).send({error: 'post not found'})
      }
      req.post = result[0];
      return next();
    }).catch(err => next(err));
  });

  router.param('uid', (req, res, next, userId) => {
    lookupUser(userId).then(result => {
      if (result.length === 0) {
        return res.status(404).send({error: 'user not found'})
      }
      req.pathUser = result[0];
      return next();
    }).catch(err => next(err));
  });
}