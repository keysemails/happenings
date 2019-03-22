const express = require('express');
const User = require('../queries/users');

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

module.exports = router;
