const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();


const getPostStars = (postId) => {
  return pool.query(
    `select u.username, s.user_id
      from happenings.stars s
      inner join happenings.users u on s.user_id = u.id
      where s.post_id = $1`
  );
}


const getPostStarCount = (postId) => {
  return pool.query(
    'select count(*) as star_count from happenings.stars where post_id = $1',
    [postId]
  );
}


const addPostStar = (userId, postId) => {
  return pool.query(
    'insert into happenings.stars (user_id, post_id) values ($1, $2)',
    [userId, postId]
  );
}


const deletePostStar = (postId, userId) => {
  return pool.query(
    'delete from happenings.stars where user_id = $1 and post_id = $2',
    [userId, postId]
  );
}

module.exports = {
  getPostStars,
  getPostStarCount,
  addPostStar,
  deletePostStar
}
