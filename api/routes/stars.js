const express = require('express');
const Stars = require('../queries/stars');

const router = express.Router({mergeParams: true});

/**
 * ----- STARS STARS STARS ------
 */
 router.get('/', (req, res, next) => {
   const postId = parseInt(req.params['post_id']);
   Stars.getPostStars(postId).then(result => {
     res.status(200).send(result.rows)
   }).catch(err => next(err));
 });


 router.get('/count', (req, res, next) => {
  const postId = parseInt(req.params['post_id']);
  Stars.getPostStarCount(postId).then(result => {
    res.status(200).send(result.rows[0])
  }).catch(err => next(err));
 });


 router.post('/', (req, res) => {
   const postId = parseInt(req.params['post_id']);
   const userId = parseInt(req.query['user_id']);
   Stars.addPostStar(userId, postId).then(result => {
     res.status(201).send({message: 'created star'})
   }).catch(err => next(err));
 });


 router.delete('/', (req, res) => {
   const postId = parseInt(req.params['post_id']);
   const userId = parseInt(req.query['user_id']);
   Stars.deletePostStar(postId, userId).then(result => {
     res.status(200).send({message: 'star deleted'});
   }).catch(err => next(err));
 });

 module.exports = router;
