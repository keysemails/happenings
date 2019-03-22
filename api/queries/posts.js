const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();


const _getPostFields = (postData) => {
  return [
    postData.user_id,
    postData.event_timestamp,
    postData.title,
    postData.description,
    postData.full_url,
    postData.full_storage_uri,
    postData.thumb_url,
    postData.thumb_storage_uri,
    postData.location,
    postData.is_private,
    postData.is_accessible,
    postData.guests_can_invite,
    postData.age_restriction
  ];
}


const createPost = (postData) => {
  const postDataCols = _getPostFields(postData);
  return pool.query(
    `insert into happenings.posts (
      user_id, username, event_timestamp, title, description, full_url,
      full_storage_uri, thumb_url, thumb_storage_uri, location, is_private,
      is_accessible, guests_can_invite, age_restriction
    )
    values (
      $1, (select username from happenings.users where id = $1),
      to_timestamp($2),
      $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    ) returning id`,
    postDataCols
  ).then(result => {
    return result.rows[0].id
  }).catch(err => {
    throw err
  });
}


const updatePost = (postId, postData) => {
  const postDataCols = _getPostFields(postData);
  return pool.query(
    `update happenings.posts set title = $1, description = $2, location = $3,
      event_timestamp = to_timestamp($4), is_private = $5, is_accessible = $6,
      guests_can_invite = $7, age_restriction = $8 where id = $9`,
    [
      postData.title,
      postData.description,
      postData.location,
      postData.event_timestamp,
      postData.is_private,
      postData.is_accessible,
      postData.guests_can_invite,
      postData.age_restriction,
      postId
    ]
  );
}


const deletePost = (postId) => {
  return pool.query(
    'delete from happenings.posts where id = $1',
    [postId]
  );
}


const getPost = (postId) => {
  return pool.query('select * from happenings.posts where id = $1',
    [postId]
  ).then(results => results.rows)
    .catch(err => {
      throw err;
  });
}


module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost
}
