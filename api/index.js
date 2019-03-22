const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { secret } = require('./conf/secret.json');
const { errorLogger, clientErrorHandler,
  pgErrorHandler, final500ErrorHandler } = require('./middleware/errors');

const conf = require('./conf');
const app = express();

/** 
 * Configure request parsing middleware
 */
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/**
 * Configure authentication middleware
 */
app.use(passport.initialize());
require('./middleware/passport.js')(passport);
app.disable('x-powered-by');


app.get('/', (req, res) => {
  res.json({info: 'node.js, express, and postgres api'})
});

/**
 * PUBLIC ROUTES
 */
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));

app.use('/posts/:post_id/comments',
  passport.authenticate('jwt', {session: false}),
  require('./routes/comments')
);
app.use('/posts/:post_id/stars',
  passport.authenticate('jwt', {session: false}),
  require('./routes/stars')
);

/**
 * PRIVATE ROUTES
 */
app.use('/users',
  passport.authenticate('jwt', {session: false}),
  require('./routes/users')
);
app.use('/users/:uid',
  passport.authenticate('jwt', {session: false}),
  require('./routes/followers')
);

/** 
 * Error handler middlewares! Our routes are generally
 * designed to pass along errors to the next handler in
 * the chain, and here is where those errors get dealt with.
 */
app.use(errorLogger);
app.use(pgErrorHandler);
app.use(final500ErrorHandler);

const PORT = conf.port || 3000;

/** avoid EADDRINUSE error when watching tests */
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`app running on port ${PORT}.`);
  });
}

module.exports = app;
