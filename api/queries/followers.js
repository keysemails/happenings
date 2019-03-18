const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();


const getUserFollowers = (userId) => {
  return pool.query(
    `select u.username, f.follower_id
      from followers f
      inner join users u on f.follower_id = u.id
      where f.user_id = $1`,
    [userId]
  );
}


const getUserFollowing = (userId) => {
  return pool.query(
    `select u.username, f.user_id
      from followers f
      inner join users u on f.user_id = u.id
      where f.follower_id = $1`,
    [userId]
  );
}


const getUserFollowerCount = (userId) => {
  return pool.query(
    'select count(follower_id) as follower_count from followers where user_id = $1',
    [userId]
  );
}


const getUserFollowingCount = (userId) => {
  return pool.query(
    'select count(user_id) as following_count from followers where follower_id = $1',
    [userId]
  );
}


const createFollow = (userId, followerId) => {
  return pool.query(
    'insert into followers (user_id, follower_id) values ($1, $2)',
    [userId, followerId]
  );
}


const deleteFollow = (userId, followerId) => {
  return pool.query(
    'delete from followers where user_id = $1 and follower_id = $2',
    [userId, followerId]
  );
}


module.exports = {
  getUserFollowers,
  getUserFollowing,
  getUserFollowerCount,
  getUserFollowingCount,
  createFollow,
  deleteFollow
};
