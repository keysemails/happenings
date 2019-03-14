const getPool = require('../connection').getConnectionPool;
const pool = getPool();


const handle500 = (err, response) => {
  console.error('FUCK');
  console.error(err);
  return response.status(500);
}


const createUser = (request, response) => {
  const { username, email, user_type, bio, is_private } = request.body;
  pool.query(
    'insert into users (username, email, user_type, bio, is_private) \
    values ($1, $2, $3, $4, $5) returning id',
    [username, email, user_type, bio, is_private]
  ).then(result => {
    response.status(201).send(`user created successfully with id ${result.rows[0].id}`)
  }).catch(err => handle500(err, response));
}


const updateUser = (request, response) => {
  const uid = parseInt(request.params.uid);
  const {username, email, user_type} = request.body;
  pool.query(
    'update users set username = $1, email = $2, user_type = $3 where id = $4',
    [name, email, user_type, uid]
  ).then(results => {
    response.status(200).send(`user modified with id ${uid}`)
  }).catch(err => handle500(err, response));
}


const deleteUser = (request, response) => {
  const uid = parseInt(request.params.uid);
  pool.query('delete from users where id = $1',
    [uid]
  ).then(results => {
    response.status(200).send(`user with id ${uid} has been deleted. see ya!`);
  }).catch(err => handle500(err, response));
}


const getUsers = (request, response) => {
    pool.query('select * from users order by id asc')
    .then(results => {
      response.status(200).json(results.rows)
    }).catch(err => handle500(err, response));
}


const getUserByUid = (request, response) => {
  const uid = request.params.uid;
  pool.query('select * from users where id = $1',
    [id]
  ).then(results => {
    response.status(200).json(results.rows)
  }).catch(err => handle500(err, response));
}


const getUserByUsername = (request, response) => {
    const username = request.params.username;
    pool.query('select * from users where username = $1',
      [username]
    ).then(results => {
      response.status(200).json(results.rows);
    }).catch(err => handle500(err, response));
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserByUid,
    getUserByUsername,
}
