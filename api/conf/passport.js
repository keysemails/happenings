const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');

const { secret } = require('./secret.json');
const getUserByUsername = require('../queries/users').getUserByUsername;

/**
 * This module holds the configuration
 * for our passport middleware.
 */
module.exports = (passport) => {
  /**
   * Extracts username and password from request body
   * and verifies user by comparing to Users table
   */
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, async (username, password, done) => {
    try {
      const userLookup = await getUserByUsername(username);
      const userDoc = userLookup[0];
      const passwordsMatch = await bcrypt.compare(password, userDoc.password_hash);
      if (passwordsMatch) {
        return done(null, userDoc);
      } else {
        return done('Incorrect Username / Password');
      }
    } catch (err) {
      done({error: err})
    }
  }));


  /**
   * extrats the JWT from the COOKIE and uses this
   * application's secret to verify its signature.
   */
  passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: secret,
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done({error: 'jwt expired'});
      }

      return done(null, jwtPayload);
    }
  ));
}
