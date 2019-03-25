const getPool = require('../util/connection').getConnectionPool;
const pool = getPool();


const getUserNotifications = (userId) => {
  return pool.query(
    'select * from happenings.notifications where user_id = $1',
    [userId]
  );
}

const addUserNotification = (userId, notifierId, postId, notificationType) => {
  return pool.query(
    `insert into happenings.notifications (user_id, notifier_id, post_id, notification_type)
    values ($1, $2, $3, $4)
    returning id`,
    [userId, notifierId, postId, notificationType]
  );
}


const markNotificationAsRead = (notificationId) => {
  return pool.query(
    `update happenings.notifications set read = true
    where id = $1`,
    [notificationId]
  );
}


const deleteNotification = (notificationId) => {
  return pool.query(
    'delete from happenings.notifications where id = $1',
    [notificationId]
  );
}


module.exports = {
  getUserNotifications,
  addUserNotification,
  markNotificationAsRead,
  deleteNotification
};
