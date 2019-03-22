const express = require('express');
const Comments = require('../queries/comments');

// lets us access path params from parent router
const router = express.Router({mergeParams: true});

/**
 * pass router through param middlewares to do post lookup
 * and 404 handling for all routes with 'post_id' param
 */
require('../middleware/params')(router);

router.get('/:post_id/comments', (req, res, next) => {
  const postId = req.post.id;
  Comments.getPostComments(postId).then(result => {
    res.status(200).send(result.rows)
  }).catch(err => next(err));
});


router.post('/:post_id/comments', (req, res, next) => {
  const postId = req.post.id;
  const { user_id, text } = req.body;
  Comments.addPostComment(postId, user_id, text).then(result => {
    res.status(201).send({message: `created comment with id ${result}`})
  }).catch(err => next(err));
});


router.delete('/:post_id/comments', (req, res, next) => {
  const postId = req.post.id;
  const commentId = parseInt(req.query['comment_id']);
  Comments.deletePostComment(postId, commentId).then(result => {
    res.status(200).send({message: 'comment deleted'});
  }).catch(err => next(err));
});

module.exports = router;
