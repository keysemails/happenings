const getPool = require('../connection').getConnectionPool;
const pool = getPool();


const createUser = (request, response) => {
  const { username, email, user_type, bio, is_private } = request.body;
  pool.query(
    'insert into users (username, email, user_type, bio, is_private) \
    values ($1, $2, $3, $4, $5)',
    [username, email, user_type, bio, is_private],
    (err, results) => {
      if (err) {
        throw err;
      }
      response.status(201).send('user created successfully');
  });
}


const updateUser = (request, response) => {
  const uid = parseInt(request.params.uid);
  const {username, email, user_type} = request.body;
  pool.query('update users set username = $1, email = $2, user_type = $3 where id = $4',
    [name, email, user_type, uid],
    (err, results) => {
      if (err) {
        throw err;
      }
      response.status(200).send(`user modified with id ${uid}`);
  });
}


const deleteUser = (request, response) => {
  const uid = parseInt(request.params.uid);
  pool.query('delete from users where id = $1',
    [uid],
    (err, results) => {
      if (err) {
        throw err;
      }
      response.status(200).send(`user with id ${uid} has been deleted. see ya!`);
  });
}


const getUsers = (request, response) => {
    pool.query('select * from users order by id asc',
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
    });
}


const getUserByUid = (request, response) => {
  const uid = request.params.uid;
  pool.query('select * from users where id = $1',
    [id],
    (err, results) => {
      if (err) {
        throw err;
      }
      response.status(200).json(results.rows);
    });
}

const getUserByUsername = (request, response) => {
    const username = request.params.username;
    pool.query('select * from users where username = $1',
      [username],
      (err, results) => {
        if (err) {
          throw err;
        }
        response.status(200).json(results.rows);
    });
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserByUid,
    getUserByUsername,
}
