const express = require('express');
const Posts = require('../queries/posts');

const router = express.Router();

/**
 * NOTE: router.get('/') is in routes/public.js since
 * GET /post/:post_id does not require authentication
 */

 require('../middleware/params')(router);

router.post('/', (req, res, next) => {
  const postData = req.body;
  Posts.createPost(postData).then(postId => {
    res.status(201).send({message: `created post with id ${postId}`})
  }).catch(err => next(err));
});


router.put('/:post_id', (req, res, next) => {
  const postId = req.post.id;
  const postData = req.body;
  Posts.updatePost(postId, postData).then(result => {
    res.status(201).send(`updated post with id ${postId}`)
  }).catch(err => next(err));
});


router.delete('/:post_id', (req, res, next) => {
  const postId = req.post.id;
  Posts.deletePost(postId).then(result => {
    res.status(200).send(`deleted post with id ${postId}`)
  }).catch(err => next(err));
});


router.get('/:post_id', (req, res, next) => {
  res.status(200).send(req.post);
});

module.exports = router;
