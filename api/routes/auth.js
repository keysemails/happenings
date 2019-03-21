const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { secret } = require('../conf/secret.json');

const hashPassword = require('../util/auth').hashPassword;
const createUser = require('../queries/users').createUser;

const { UNIQUE_VIOLATION } = require('pg-error-constants');
const router = express.Router();
const MILLISECONDS_IN_DAY = 86400000;


/**
 *  ACCOUNT REGISTRATION (CREATE USER)
 */
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;

  const HASH_COST = 10;

  try {
    const passwordHash = await hashPassword(password);
    const uid = await createUser(username, email, passwordHash);
    res.status(201).send({ username, uid })

  } catch (err) {
    next(err);
  }
});


/**
 * LOG IN USER
 * 
 * authenticating with the local strategy
 * if authentication succeeds, compose a payload for a JWT
 * and call req.login to assign the payload to req.user.
 */
router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    (error, user) => {
      if (error || !user) {
        return res.status(400).json({ error: 'username and/or password incorrect' });
      }

      /** this is what ends up in the JWT */
      const payload = {
        user_id: user.id,
        username: user.username,
        expiresIn: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS || MILLISECONDS_IN_DAY),
      };

      /** assigns payload to req.user */
      req.login(user, { session: false }, (error) => {
        if (error) {
          next(error);
        }
        /** generate a signed JWT and return it in the response */
        const token = jwt.sign(payload, secret);

        /** assign our jwt to the cookie */
        res.cookie('jwt', token, { httpOnly: true, secure: true });
        return res.status(200).send({ token: token });
      });
    },
  )(req, res, next);
});

module.exports = router;
