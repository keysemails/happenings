const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcrypt');

const { secret } = require('./secret.json');
const lookupUser = require('../queries/users').lookupUserPasswordHash;

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
      const userLookup = await lookupUser(username);
      const userDoc = userLookup.rows[0];
      const passwordsMatch = await bcrypt.compare(password, userDoc.password_hash);
      if (passwordsMatch) {
        return done(null, userDoc);
      } else {
        return done({error: 'Incorrect Username / Password'});
      }
    } catch (err) {
      next(err);
    }
  }));


  /**
   * extracts the JWT from the Authorization header and uses this
   * application's secret to verify its signature.
   */
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expiresIn) {
        let error = 'jwt expired';
        return done(error, false);
      }
      return done(null, jwtPayload);
    }
  ));
}
