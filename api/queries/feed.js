const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();

/**
 * Fans out a newly created post_id
 * to all the users followers
 */
const mainFeedFanOut = (userId, postId) => {
  return pool.query('select happenings.main_feed_fanout($1, $2)', [userId, postId]);
}


/**
 * Fans out a post that was interacted with by a user
 * to their followers' discover feeds
 */
const discoverFeedFanout = (userId, postId, activityType) => {
  return pool.query('select happenings.discover_feed_fanout($1, $2, $3)',
    [userId, postId, activityType]);
}

module.exports = {
  mainFeedFanOut,
  discoverFeedFanout
}