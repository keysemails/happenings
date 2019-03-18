const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { secret } = require('./conf/secret.json');

const app = express();

const port = 3000;

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
require('./conf/passport.js')(passport);
app.disable('x-powered-by');


app.get('/', (req, res) => {
  res.json({info: 'node.js, express, and postgres api'})
});

/**
 * PUBLIC ROUTES
 */
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));

/**
 * PRIVATE ROUTES
 */
app.use('/users',
  passport.authenticate('jwt', {session: false}),
  require('./routes/users')
);


app.listen(port, () => {
  console.log(`app running on port ${port}.`);
});
