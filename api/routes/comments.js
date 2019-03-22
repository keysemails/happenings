const express = require('express');
const Comments = require('../queries/comments');

// lets us access path params from parent router
const router = express.Router({mergeParams: true});

/**
 * /posts/:post_id/comments
 */

router.get('/', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  Comments.getPostComments(postId).then(result => {
    res.status(200).send(result.rows)
  }).catch(err => next(err));
});


router.post('/', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  const { user_id, text } = req.body;
  Comments.addPostComment(postId, user_id, text).then(result => {
    res.status(201).send({message: `created comment with id ${result}`})
  }).catch(err => next(err));
});


router.delete('/', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  const commentId = parseInt(req.query['comment_id']);
  Comments.deletePostComment(postId, commentId).then(result => {
    res.status(200).send({message: 'comment deleted'});
  }).catch(err => next(err));
});

module.exports = router;
