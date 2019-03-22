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

module.exports = router;
