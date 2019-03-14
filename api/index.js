const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


app.get('/', (req, res) => {
    res.json({info: 'node.js, express, and postgres api'})
});

const userViews = require('./views/users');
const postViews = require('./views/posts');


/**
 * USER ENDPOINTS
 */
app.get('/users', userViews.getUsers);
app.get('/users/:username', userViews.getUserByUsername);
app.get('/users/:username/posts', postViews.getUserPosts);
app.post('/users', userViews.createUser);
app.put('/users/:uid', userViews.updateUser);
app.delete('/users/:uid', userViews.deleteUser);

/**
 * POST ENDPOINTS
 */
app.post('/posts', postViews.createPost);
app.get('/posts/:post_id', postViews.getPost);
app.put('/posts/:post_id', postViews.updatePost);
app.delete('/posts/:post_id', postViews.deletePost);

app.listen(port, () => {
    console.log(`app running on port ${port}.`);
});

