const express = require('express');
const Stars = require('../queries/stars');
const { discoverFeedFanout } = require('../queries/feed');
const { ACTIVITY_TYPES } = require('../util/constants');

const asyncWrap = require('../middleware/wrap');
const router = express.Router({mergeParams: true});

/**
 * pass router through param middlewares to do post lookup
 * and 404 handling for all routes with 'post_id' param
 */
require('../middleware/params')(router);

router.get('/:post_id/stars/', asyncWrap(async (req, res, next) => {
  const postId = req.post.id;
  const result = await Stars.getPostStars(postId);
  res.status(200).send(result.rows);
}));


router.get('/:post_id/stars/count', asyncWrap(async (req, res, next) => {
  const postId = req.post.id;
  const result = await Stars.getPostStarCount(postId);
  res.status(200).send(result.rows[0]);
}));

/**
 * star a post
 * body params:
 *   user_id: the id of the user
 */
router.post('/:post_id/stars', asyncWrap(async (req, res, next) => {
  const postId = req.post.id;
  const userId = req.user.user_id;
  Promise.all([
    Stars.addPostStar(userId, postId),
    discoverFeedFanout(userId, postId, ACTIVITY_TYPES.STAR)
  ]).then(() => res.status(201).send({message: 'created star'}));
}));


 router.delete('/:post_id/stars/', (req, res, next) => {
   const postId = req.post.id;
   const userId = parseInt(req.query['user_id']);
   Stars.deletePostStar(postId, userId).then(result => {
     res.status(200).send({message: 'star deleted'});
   }).catch(err => next(err));
 });

 module.exports = router;
