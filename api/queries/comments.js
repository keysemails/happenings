const getPool = require('../connection').getConnectionPool;
const pool = getPool();


const getPostComments = (postId) => {
  return pool.query(
    'select * from comments where post_id = $1 order by created desc',
    [postId]
  );
}


const addPostComment = (postId, userId, text) => {
  return pool.query(
    `insert into comments (post_id, user_id, username, text)
    values ($1, $2, (select username from users where id = $2), $3)
    returning id`,
    [postId, userId, text]
  ).then(result => {
    return result.rows[0]['id'];
  }).catch(err => {
    throw err
  });
}


const deletePostComment = (postId, commentId) => {
  return pool.query(
    'delete from comments where id = $1 and post_id = $2',
    [commentId, postId]
  );
}

module.exports = {
  getPostComments,
  addPostComment,
  deletePostComment
}
