const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../conf/secret.json');
const createUser = require('../queries/users').createUser;
const { UNIQUE_VIOLATION } = require('pg-error-constants');
const router = express.Router();
const MILLISECONDS_IN_DAY = 86400000


/**
 *  ACCOUNT REGISTRATION (CREATE USER)
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const HASH_COST = 10;

  try {
    const passwordHash = await bcrypt.hash(password, HASH_COST);
    const uid = await createUser(username, email, passwordHash);
    res.status(200).send({ username, uid })

  } catch (err) {
    console.error(err);
    if (err.code === UNIQUE_VIOLATION) {
      res.status(400).send({error: 'username or email already exists'})
    }
    res.status(400).send({
      error: 'req body should take the form { username, email, password }'
    });
  }
});


/**
 * authenticating with the local strategy
 * if authentication succeeds, compose a payload for a JWT
 * and call req.login to assign the payload to req.user.
 */
router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    (error, user) => {
      console.log(user);
      if (error || !user) {
        res.status(400).json({ error });
      }

      /** this is what ends up in the JWT */
      const payload = {
        username: user.username,
        expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS || MILLISECONDS_IN_DAY),
      };

      /** assigns payload to req.user */
      req.login(payload, { session: false }, (error) => {
        if (error) {
          res.status(400).send({ error });
        }

        /** generate a signed JWT and return it in the response */
        const token = jwt.sign(JSON.stringify(payload), secret);

        /** assign our jwt to the cookie */
        res.cookie('jwt', jwt, { httpOnly: true, secure: true });
        res.status(200).send({ username: user.username });
      });
    },
  )(req, res, next);
});

module.exports = router;
