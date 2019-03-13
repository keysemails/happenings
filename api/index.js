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

const users = require('./views/users');
app.get('/users', users.getUsers);
app.get('/users/:username', users.getUserByUsername);
app.post('/users', users.createUser);
app.put('/users/:uid', users.updateUser);
app.delete('/users/:uid', users.deleteUser);

app.listen(port, () => {
    console.log(`app running on port ${port}.`);
});
