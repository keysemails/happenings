const express = require('express');
const Follow = require('../queries/followers');

// lets us access path params from parent router
const router = express.Router({mergeParams: true});

/**
 * GET FOLLOWERS
 * @param  {[type]} '/:uid/followers' [description]
 * @return {Array}                   list of (follower_id, username)
 */
router.get('/:uid/followers', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowers(userId).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});


/**
 * GET FOLLOWING
 * @param  {[type]} '/following' uid doing the following
 * @return {Array}                   list of (user_id, username)
 */
router.get('/:uid/following', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowing(userId).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});


/**
 * FOLLOW USER '/followers?follower_id'
 * @param {str} 'uid' the user to be followed
 * @param {str} 'follower_id' the user doing the following
 */
router.post('/:uid/followers', (req, res, next) => {
  const followeeId = parseInt(req.params.uid);
  const followerId = parseInt(req.query['follower_id']);

  // can only make yourself a follower of others
  if (req.user.user_id === followerId) {
    // const followFunc = req.user.is_private ?
    // Follow.createFollow : Follow.createFollowRequest;
    Follow.createFollow(followeeId, followerId).then(result => {
      res.status(201).send({
        message: `user ${followerId} now following user ${followeeId}`
      })
    }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});


/**
 * GET FOLLOWER COUNT
 * @param  {[type]} '/follower_count'
 */
router.get('/:uid/follower_count', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowerCount(userId).then(result => {
    res.status(200).json(result.rows[0])
  }).catch(err => next(err));
});

/**
 * GET FOLLOWING COUNT
 * @param  {[type]} '/following_count'
 */
router.get('/:uid/following_count', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowingCount(userId).then(result => {
    res.status(200).json(result.rows[0])
  }).catch(err => next(err));
});


/**
 * @description UNFOLLOW A USER
 * @param { } [follower_id] [id of the person doing the unfollow]
 * constraint: follower_id === req.user.user_id
 */
router.delete('/:uid/followers', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  const followerId = parseInt(req.query['follower_id']);

  if (req.user.user_id === followerId) {
    Follow.deleteFollow(userId, followerId).then(result => {
      if (result.rowCount === 0) {
        return res.status(400).send({error: 'follow not found'})
      }
      res.status(200).send({
        message: `user ${followerId} no longer following user ${userId}`
      })
    }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
