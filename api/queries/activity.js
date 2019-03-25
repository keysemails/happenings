const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();

const recordUserActivity = (userId, postId, activityType, eventTimestamp) => {
  return pool.query(
    `insert into happenings.activity (user_id, post_id, activity_type, event_timestamp)
      values (
        $1,
        $2,
        $3,
        (select event_timestamp::timestamp from happenings.posts where id = $2)
      )
      returning id
    `,
    [userId, postId, activityType]
  );
}

module.exports = {
  recordUserActivity
};
