const getPool = require('../connection').getConnectionPool;
const pool = getPool();


const getPostFields = (requestBody) => {
  const {
    user_id,
    username,
    event_timestamp,
    title,
    description,
    full_url,
    full_storage_uri,
    thumb_url,
    thumb_storage_uri,
    location,
    is_private,
    is_accessible,
    guests_can_invite,
    age_restriction
  } = requestBody; // POST request ha ha ha
  return [
      user_id,
      username,
      event_timestamp,
      title,
      description,
      full_url,
      full_storage_uri,
      thumb_url,
      thumb_storage_uri,
      location,
      is_private,
      is_accessible,
      guests_can_invite,
      age_restriction
    ];
}

/**
 * method - POST
 * Body params:
 * - user_id            integer
 * - username           string
 * - event_timestamp    10-digit integer (UNIX)
 * - title              string
 * - description        string
 * - full_url           string
 * - full_storage_uri   string
 * - thumb_url          string
 * - thumb_storage_uri  string
 * - location           string
 * - is_private         bool
 * - is_accessible      bool
 * - guests_can_invite  bool
 * - age_restriction    string
 */
const createPost = (request, response) => {
  const postDataCols = getPostFields(request.body);
  pool.query(
    `insert into posts (
      user_id, username, event_timestamp, title, description, full_url,
      full_storage_uri, thumb_url, thumb_storage_uri, location, is_private,
      is_accessible, guests_can_invite, age_restriction
    )
    values (
      $1, $2, to_timestamp($3), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    ) returning id`,
    postDataCols
  ).then(result => {
    response.status(201).send(`post created successfully with id ${result.rows[0].id}`)
  }).catch(err => response.status(500))
}

/**
 * method - PUT
 * Body params:
 * - event_timestamp    10-digit integer (UNIX)
 * - title              string
 * - description        string
 * - location           string
 * - is_private         bool
 * - is_accessible      bool
 * - guests_can_invite  bool
 * - age_restriction    string
 */
const updatePost = (request, response) => {
  const postId = parseInt(request.params.post_id);
  const {
    title,
    description,
    location,
    event_timestamp,
    is_private,
    is_accessible,
    guests_can_invite,
    age_restriction
  } = request.body;
  pool.query(
    `update posts set title = $1, description = $2, location = $3,
      event_timestamp = to_timestamp($4), is_private = $5, is_accessible = $6,
      guests_can_invite = $7, age_restriction = $8 where id = $9`,
    [
      title,
      description,
      location,
      event_timestamp,
      is_private,
      is_accessible,
      guests_can_invite,
      age_restriction,
      postId
    ]
  ).then(result => {
    response.status(200).send(`updated event with id ${postId}`)
  }).catch(err => {
    console.error(err);
    response.status(500)
  });
}

/**
 * method - DELETE
 * URL param:
 * - post_id    string
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
const deletePost = (request, response) => {
  const postId = parseInt(request.params.post_id);
  pool.query(
    'delete from posts where id = $1',
    [postId]
  ).then(result => {
    response.status(200).send(`deleted post with id ${postId}`)
  }).catch(err => {
    console.error(err);
    response.status(500);
  });
}


const getPost = (request, response) => {
  const post_id = parseInt(request.params.post_id);
  pool.query('select * from posts where id = $1',
    [post_id]
  ).then(results => {
    response.status(200).send(results.rows);
  }).catch(err => {
    response.status(404).send('uhh didnt find this one')
  });
}


const getUserPosts = (request, response) => {
  const user_id = request.params.user_id;
  pool.query(
    'select * from posts where user_id = $1 order by created asc',
    [user_id]
  ).then(results => {
    response.status(200).send(results.rows)
  }).catch(err => {
    console.error(err);
    response.status(500);
  });
}


module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getUserPosts
}
