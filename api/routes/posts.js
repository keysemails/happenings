const express = require('express');
const Posts = require('../queries/posts');

const router = express.Router();


router.post('/', (req, res) => {
  const postData = req.body;
  Posts.createPost(postData).then(postId => {
    res.status(201).send({message: `created post with id ${postId}`})
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


router.put('/:post_id', (req, res) => {
  const postId = parseInt(req.params.post_id);
  const postData = req.body;
  Posts.updatePost(postId, postData).then(result => {
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(201).send(`updated post with id ${postId}`)
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


router.delete('/:post_id', (req, res) => {
  const postId = parseInt(req.params.post_id);
  Posts.deletePost(postId).then(result => {
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(200).send(`deleted post with id ${postId}`)
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


router.get('/:post_id', (req, res) => {
  const post_id = parseInt(req.params.post_id);
  Posts.getPost(post_id).then(result => {
    if (result.length === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(200).send(result)
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});

module.exports = router;
