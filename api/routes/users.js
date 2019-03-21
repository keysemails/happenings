const express = require('express');
const passport = require('passport');
const User = require('../queries/users');
const Follow = require('../queries/followers');

const router = express.Router();

/**
 * There is no router.post('/') here, as that is effectively router.post('/register')
 * found in routes/auth.js
 */

/**
 * Helper to check if the requesting client
 * corresponds to the UID on the requested resource
 */
const _UIDisCurrUser = (req) => {
  const uid = parseInt(req.params['uid']);
  const isCurrUser = (uid === req.user.user_id);
  return [uid, isCurrUser];
}

/**
 * GET USER INTO BY USERNAME
 * @param  {[type]} '/:username' [description]
 * @return {[type]}              [description]
 */
router.get('/:username', (req, res, next) => {
  const username = req.params.username;
  User.getUserByUsername(username)
    .then(result => {
      if (result.length === 0) {
        return res.status(404).send({error: 'not found'});
      }
      res.status(200).json(result);
  }).catch(err => next(err));
});

/**
 * PUT - Update a User's information
 */
router.put('/:uid', (req, res, next) => {
  const [uid, isCurrUser] = _UIDisCurrUser(req);
  if (isCurrUser) {
    const { username, email, user_type, bio, is_private } = req.body;
    User.updateUser(uid, username, email, user_type, bio, is_private)
      .then(result => {
        res.status(200).json({message: `user ${uid} updated.`})
    }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});


/*
 * DELETE - delete a user's account.
 */
router.delete('/:uid', (req, res, next) => {
  const [uid, isCurrUser] = _UIDisCurrUser(req);
  if (isCurrUser) {
    User.deleteUser(uid)
      .then(result => {
        res.status(200).send({ message: 'user deleted'})
    }).catch(err => next(err));
  } else {
    res.status(401).send({error: 'Unauthorized'})
  }
});


/*
 * ---------- FOLLOWERS / FOLLOWING ROUTES ---------
 */

/**
 * GET FOLLOWERS
 * @param  {[type]} '/:uid/followers' [description]
 * @return {Array}                   list of (user_id, username)
 */
router.get('/:uid/followers', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowers(userId).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});


/**
 * GET FOLLOWING
 * @param  {[type]} '/:uid/following' uid doing the following
 * @return {Array}                   list of (user_id, username)
 */
router.get('/:uid/following', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowing(userId).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});


/**
 * FOLLOW USER '/:uid/followers?follower_id'
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
  }
});


/**
 * GET FOLLOWER COUNT
 * @param  {[type]} '/:uid/follower_count'
 */
router.get('/:uid/follower_count', (req, res, next) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowerCount(userId).then(result => {
    res.status(200).json(result.rows[0])
  }).catch(err => next(err));
});

/**
 * GET FOLLOWING COUNT
 * @param  {[type]} '/:uid/following_count'
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
