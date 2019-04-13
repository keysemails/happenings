const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();


const attendEvent = (userId, postId) => {
  return pool.query(
    `insert into happenings.attendance (user_id, post_id, event_timestamp)
    values (
      $1,
      $2,
      (select event_timestamp from happenings.posts where id = $2)
    )`,
    [userId, postId]
  );
}

// chronological all-time
const getUserAttendance = (userId) => {
  return pool.query(
    `select post_id from happenings.attendance
    where user_id = $1 order by event_timestamp asc`,
    [userId]
  );
}


const getUserAttendanceUpcoming = (userId) => {
  return pool.query(
    `select post_id from happenings.attendance
    where user_id = $1 and event_timestamp > current_timestamp
    order by event_timestamp asc`,
    [userId]
  )
}


const getUserAttendancePast = (userId) => {
  return pool.query(
    `select post_id from happenings.attendance
    where user_id = $1 and event_timestamp < current_timestamp
    order by event_timestamp desc`,
    [userId]
  )
}


const getPostAttendance = (postId) => {
  return pool.query(
    `select a.user_id, u.username
    from happenings.attendance a
    inner join happenings.users u
    on a.user_id = u.id
    where a.post_id = $1`,
    [postId]
  )
}


const getPostAttendanceCount = (postId) => {
  return pool.query(
    `select count(user_id) as attendance_count from happenings.attendance
    where post_id = $1`,
    [postId]
  );
}

// should only work on events that havent happened yet
const removeAttendance = (userId, postId) => {
  return pool.query(
    `delete from happenings.attendance
    where user_id = $1 and post_id = $2`,
    [userId, postId]
  );
}


module.exports = {
  attendEvent,
  getUserAttendance,
  getUserAttendanceUpcoming,
  getUserAttendancePast,
  getPostAttendance,
  getPostAttendanceCount,
  removeAttendance
};

