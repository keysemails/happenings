const getPool = require('../connection').getConnectionPool;
const pool = getPool();


const getPostStars = (postId) => {
  return pool.query(
    `select u.username, s.user_id
      from stars s
      inner join users u on s.user_id = u.id
      where s.post_id = $1`
  );
}


const getPostStarCount = (postId) => {
  return pool.query(
    'select count(*) as star_count from stars where post_id = $1',
    [postId]
  );
}


const addPostStar = (userId, postId) => {
  return pool.query(
    'insert into stars (user_id, post_id) values ($1, $2)',
    [userId, postId]
  );
}


const deletePostStar = (postId, userId) => {
  return pool.query(
    'delete from stars where user_id = $1 and post_id = $2',
    [userId, postId]
  );
}

module.exports = {
  getPostStars,
  getPostStarCount,
  addPostStar,
  deletePostStar
}
