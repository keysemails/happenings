const express = require('express');
const User = require('../queries/users');

const router = express.Router();

/**
 * There is no router.post('/') here, as that is effectively router.post('/register')
 * found in routes/auth.js
 */


router.get('/', (req, res) => {
  User.getUsers()
    .then(results => {
      res.status(200).json(results)
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

module.exports = router;
