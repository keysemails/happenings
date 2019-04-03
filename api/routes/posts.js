const express = require('express');
const Posts = require('../queries/posts');
const Feed = require('../queries/feed');

const asyncWrap = require('../middleware/wrap');

const router = express.Router();

/**
 * NOTE: router.get('/') is in routes/public.js since
 * GET /post/:post_id does not require authentication
 */

 require('../middleware/params')(router);


router.post('/', asyncWrap(async (req, res, next) => {
  const userIsAuthor = (req.user.user_id === req.body.user_id);
  if (userIsAuthor) {
    const userId = req.user.user_id;
    const postData = req.body;
    const postId = await Posts.createPost(postData);
    const fanout = await Feed.mainFeedFanOut(userId, postId);
    return res.status(201).send({post_id: postId});
  } else {
    res.status(401).send('Unauthorized');
  }
}));


router.put('/:post_id', asyncWrap(async (req, res, next) => {
  const userIsAuthor = (req.post.user_id === req.user.user_id);
  if (userIsAuthor) {
    const postId = req.post.id;
    const postData = req.body;
    const result = await Posts.updatePost(postId, postData);
    return res.status(201).send(`updated post with id ${postId}`)
  } else {
    res.status(401).send('Unauthorized');
  }
}));


router.delete('/:post_id', asyncWrap(async (req, res, next) => {
  const userIsAuthor = (req.post.user_id === req.user.user_id)
  if (userIsAuthor) {
    const postId = req.post.id;
    const result = await Posts.deletePost(postId);
    return res.status(200).send({message: `deleted post with id ${postId}`})
  } else {
    res.status(401).send('Unauthorized');
  }
}));


router.get('/:post_id', (req, res, next) => {
  // DB lookup already completed in params middleware
  res.status(200).send(req.post);
});

module.exports = router;
