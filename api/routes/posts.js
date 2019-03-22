const express = require('express');
const Posts = require('../queries/posts');

const router = express.Router();

/**
 * NOTE: router.get('/') is in routes/public.js since
 * GET /post/:post_id does not require authentication
 */

 require('../middleware/params')(router);

router.post('/', (req, res, next) => {
  const userIsAuthor = (req.user.user_id === req.body.user_id);
  if (userIsAuthor) {
    const postData = req.body;
    Posts.createPost(postData).then(postId => {
      res.status(201).send({message: `created post with id ${postId}`})
    }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});


router.put('/:post_id', (req, res, next) => {
  const userIsAuthor = (req.post.user_id === req.user.user_id);
  if (userIsAuthor) {
    const postId = req.post.id;
    const postData = req.body;
    Posts.updatePost(postId, postData).then(result => {
      res.status(201).send(`updated post with id ${postId}`)
    }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});


router.delete('/:post_id', (req, res, next) => {
  const userIsAuthor = (req.post.user_id === req.user.user_id)
  if (userIsAuthor) {
    const postId = req.post.id;
    Posts.deletePost(postId).then(result => {
      res.status(200).send({message: `deleted post with id ${postId}`})
    }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});


router.get('/:post_id', (req, res, next) => {
  res.status(200).send(req.post);
});

module.exports = router;
