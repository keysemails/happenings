const express = require('express');

const Posts = require('../queries/posts');
const Comments = require('../queries/comments');
const Stars = require('../queries/stars');

const router = express.Router();


router.post('/', (req, res, next) => {
  const postData = req.body;
  Posts.createPost(postData).then(postId => {
    res.status(201).send({message: `created post with id ${postId}`})
  }).catch(err => next(err));
});


router.put('/:post_id', (req, res, next) => {
  const postId = parseInt(req.params.post_id);
  const postData = req.body;
  Posts.updatePost(postId, postData).then(result => {
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(201).send(`updated post with id ${postId}`)
  }).catch(err => next(err));
});


router.delete('/:post_id', (req, res, next) => {
  const postId = parseInt(req.params.post_id);
  Posts.deletePost(postId).then(result => {
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(200).send(`deleted post with id ${postId}`)
  }).catch(err => next(err));
});


router.get('/:post_id', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  Posts.getPost(postId).then(result => {
    if (result.length === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(200).send(result)
  }).catch(err => next(err));
});


/** 
 * COMMENTS COMMENTS COMMENTS COMMENTS
 */

router.get('/:post_id/comments', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  Comments.getPostComments(postId).then(result => {
    res.status(200).send(result.rows)
  }).catch(err => next(err));
});


router.post('/:post_id/comments', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  const { user_id, text } = req.body;
  Comments.addPostComment(postId, user_id, text).then(result => {
    res.status(201).send({message: `created comment with id ${result}`})
  }).catch(err => next(err));
});


router.delete('/:post_id/comments', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  const commentId = parseInt(req.query['comment_id']);
  Comments.deletePostComment(postId, commentId).then(result => {
    res.status(200).send({message: 'comment deleted'});
  }).catch(err => next(err));
});


/**
 * ----- STARS STARS STARS ------
 */
 router.get('/:post_id/stars', (req, res, next) => {
   const postId = parseInt(req.params['post_id']);
   Stars.getPostStars(postId).then(result => {
     res.status(200).send(result.rows)
   }).catch(err => next(err));
 });


 router.get('/:post_id/star_count', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  Stars.getPostStarCount(postId).then(result => {
    res.status(200).send(result.rows[0])
  }).catch(err => next(err));
 });


 router.post('/:post_id/stars', (req, res) => {
   const postId = parseInt(req.params['post_id']);
   const userId = parseInt(req.query['user_id']);
   Stars.addPostStar(userId, postId).then(result => {
     res.status(201).send({message: 'created star'})
   }).catch(err => next(err));
 });


 router.delete('/:post_id/stars', (req, res) => {
   const postId = parseInt(req.params['post_id']);
   const userId = parseInt(req.query['user_id']);
   Stars.deletePostStar(postId, userId).then(result => {
     res.status(200).send({message: 'star deleted'});
   }).catch(err => next(err));
 });

module.exports = router;
