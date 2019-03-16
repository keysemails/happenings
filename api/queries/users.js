const getPool = require('../connection').getConnectionPool;
const pool = getPool();


/**
 * method - POST
 */
const createUser = (username, email, passwordHash) => {
  return pool.query(
    'insert into users (username, email, password_hash) \
    values ($1, $2, $3) returning id',
    [username, email, passwordHash]
  ).then(result => {
    return result.rows[0].id
  }).catch(err => {
    throw err;
  });
}


const updateUser = (uid, username, email, user_type, bio, is_private) => {
  return pool.query(
    `update users set username = $1, email = $2,
      user_type = $3, bio = $4, is_private = $5 where id = $6`,
    [username, email, user_type, bio, is_private, uid]
  )
}


const deleteUser = (uid) => {
  return pool.query('delete from users where id = $1',
    [uid]
  )
}


const getUsers = () => {
  return pool.query('select * from users order by id asc')
    .then(result => {
      return result.rows
  }).catch(err => {
      throw err
  });
}


const getUserByUid = (request, response) => {
  const uid = request.params.uid;
  pool.query(
    'select id, username, email, user_type, bio,\
    is_private from users where id = $1',
    [id]
  ).then(results => {
    response.status(200).json(results.rows)
  }).catch(err => handle500(err, response));
}


const getUserByUsername = (username) => {
  return pool.query(
    'select id, username, email, user_type, bio, \
    is_private from users where username = $1',
    [username]
  ).then(result => result.rows).catch(err => {throw err})
}


module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserByUid,
    getUserByUsername,
}
