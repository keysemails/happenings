const express = require('express');
const User = require('../queries/users');
const Follow = require('../queries/followers');
const { FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION } = require('pg-error-constants');

const router = express.Router();

/**
 * There is no router.post('/') here, as that is effectively router.post('/register')
 * found in routes/auth.js
 */


router.get('/', (req, res) => {
  User.getUsers()
    .then(result => {
      res.status(200).json(result.rows)
  }).catch(err => {
    console.error(err.stack);
    res.status(500);
  });
});


router.get('/:username', (req, res) => {
  const username = req.params.username;
  User.getUserByUsername(username)
    .then(result => {
      if (result.length === 0) {
        res.status(404).send({error: 'not found'});
      }
      res.status(200).json(result);
  }).catch(err => {
    res.status(400).send({error: 'error searching for username'})
  });
});

/**
 * PUT - Update a User's information
 */
router.put('/:uid', (req, res) => {
  const uid = parseInt(req.params.uid);
  const { username, email, user_type, bio, is_private } = req.body;
  User.updateUser(uid, username, email, user_type, bio, is_private)
    .then(result => {
      res.status(200).send({ messsage: `user ${uid} updated.`})
  }).catch(err => {
    console.error(err);
    res.status(500).send({error: 'unable to update user'})
  });
});


/*
 * DELETE - delete a user's account.
 * TODO: delete all associated posts, comments, stars
 */
router.delete('/:uid', (req, res) => {
  const uid = parseInt(req.params.uid);
  User.deleteUser(uid)
    .then(result => {
      res.status(200).send({ message: 'user deleted'})
  }).catch(err => {
    console.error(err);
    res.status(400).send({ error: 'idk' })
  });
});


/*
 * ---------- FOLLOWERS / FOLLOWING ROUTES ---------
 */

router.get('/:uid/followers', (req, res) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowers(userId).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => {
    console.error(err);
    res.status(500);
  })
});


router.post('/:uid/followers', (req, res) => {
  const userId = parseInt(req.params.uid);
  const followerId = parseInt(req.query['follower_id']);
  Follow.createFollow(userId, followerId).then(result => {
    res.status(201).send({message: `user ${followerId} now following user ${userId}`})
  }).catch(err => {
    console.error(err);
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(400).send({error: `user ${followerId} already following user ${userId}`})
    }
    if (err.code === FOREIGN_KEY_VIOLATION) {
      return res.status(400).send({error: `user_id or follower_id does not exist`})
    }
    return res.status(500);
  })
});


router.get('/:uid/following', (req, res) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowing(userId).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => {
    console.error(err);
    res.status(500);
  })
});


router.get('/:uid/follower_count', (req, res) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowerCount(userId).then(result => {
    res.status(200).json(result.rows[0])
  }).catch(err => {
    console.error(err);
    res.status(500);
  })
});


router.get('/:uid/following_count', (req, res) => {
  const userId = parseInt(req.params.uid);
  Follow.getUserFollowingCount(userId).then(result => {
    res.status(200).json(result.rows[0])
  }).catch(err => {
    console.error(err);
    res.status(500);
  })
});


router.delete('/:uid/followers', (req, res) => {
  const userId = parseInt(req.params.uid);
  const followerId = parseInt(req.query['follower_id']);
  Follow.deleteFollow(userId, followerId).then(result => {
    if (result.rowCount === 0) {
      res.status(400).send({error: 'follow not found'})
    }
    res.status(200).send({message: `user ${followerId} no longer following user ${userId}`})
  }).catch(err => {
    console.error(err);
    res.status(500);
  })
});


module.exports = router;
