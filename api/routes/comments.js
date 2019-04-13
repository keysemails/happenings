const express = require('express');
const Comments = require('../queries/comments');
const { discoverFeedFanout } = require('../queries/feed');
const { ACTIVITY_TYPES } = require('../util/constants');

const asyncWrap = require('../middleware/wrap');

// lets us access path params from parent router
const router = express.Router({mergeParams: true});

/**
 * pass router through param middlewares to do post lookup
 * and 404 handling for all routes with 'post_id' param
 */
require('../middleware/params')(router);

router.get('/:post_id/comments', asyncWrap(async (req, res, next) => {
  const postId = req.post.id;
  const result = await Comments.getPostComments(postId);
  return res.status(200).send(result.rows);
}));

/**
 * create a comment
 * body params:
 *   text: the comment text
 */
router.post('/:post_id/comments', asyncWrap(async (req, res, next) => {
  const postId = req.post.id;
  const userId = req.user.user_id;
  Promise.all([
    Comments.addPostComment(postId, userId, req.body.text),
    discoverFeedFanout(userId, postId, ACTIVITY_TYPES.COMMENT)
  ]).then(result => res.status(201).send(
    {message: `created comment with id ${result[0]}`}
    ));
}));


router.delete('/:post_id/comments', asyncWrap(async (req, res, next) => {
  const postId = req.post.id;
  const commentId = parseInt(req.query['comment_id']);
  const result = await Comments.deletePostComment(postId, commentId);
  return res.status(200).send({message: 'comment deleted'});
}));

module.exports = router;
