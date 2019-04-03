const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();

/**
 * Fans out a newly created post_id
 * to all the users followers
 */
const mainFeedFanOut = (userId, postId) => {
  console.log('fanning out to', userId, postId);
  return pool.query(
    'select happenings.main_feed_fanout($1, $2)',
    [userId, postId]
  );
}


/**
 * Fans out a post that was interacted with by a user
 * to their followers' discover feeds
 */
const discoverFeedFanout = (userId, postId, activityType) => {
  return pool.query('select happenings.discover_feed_fanout($1, $2, $3)',
    [userId, postId, activityType]);
}

// TODO: pagination
const getMainFeed = (userId) => {
  return pool.query(
    `select post_id
      from happenings.main_feed
      where user_id = $1`,
      [userId]
    );
}

//TODO: pagination
const getDiscoverFeed = (userId) => {
  return pool.query(
    `select post_id, followee_id, activity_type, event_timestamp
      from happenings.discover_feed
      where user_id = $1`,
      [userId]
    );
}

module.exports = {
  mainFeedFanOut,
  discoverFeedFanout,
  getMainFeed,
  getDiscoverFeed
}