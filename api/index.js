const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const port = 3000;

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


app.get('/', (req, res) => {
    res.json({info: 'node.js, express, and postgres api'})
});

/**
 * ROUTES
 */
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));


app.listen(port, () => {
  console.log(`app running on port ${port}.`);
});
