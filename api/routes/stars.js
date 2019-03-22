const express = require('express');
const Stars = require('../queries/stars');

const router = express.Router({mergeParams: true});

/**
 * pass router through param middlewares to do post lookup
 * and 404 handling for all routes with 'post_id' param
 */
require('../middleware/params')(router);

 router.get('/:post_id/stars/', (req, res, next) => {
   const postId = req.params['post_id'];
   Stars.getPostStars(postId).then(result => {
     res.status(200).send(result.rows)
   }).catch(err => next(err));
 });


 router.get('/:post_id/stars/count', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  Stars.getPostStarCount(postId).then(result => {
    res.status(200).send(result.rows[0])
  }).catch(err => next(err));
 });


 router.post('/:post_id/stars/', (req, res) => {
   const postId = parseInt(req.params['post_id']);
   const userId = parseInt(req.query['user_id']);
   Stars.addPostStar(userId, postId).then(result => {
     res.status(201).send({message: 'created star'})
   }).catch(err => next(err));
 });


 router.delete('/:post_id/stars/', (req, res) => {
   const postId = parseInt(req.params['post_id']);
   const userId = parseInt(req.query['user_id']);
   Stars.deletePostStar(postId, userId).then(result => {
     res.status(200).send({message: 'star deleted'});
   }).catch(err => next(err));
 });

 module.exports = router;
