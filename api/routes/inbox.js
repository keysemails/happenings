const express = require('express');
const Notification = require('../queries/notifications');

const router = express.Router();

 require('../middleware/params')(router);

// lil helper
 const isCurrUser = (req) => req.user.user_id === req.pathUser.id;


router.get('/:uid', (req, res, next) => {
  if (isCurrUser(req)) {
    let userId = req.pathUser.id;
    Notification.getUserNotifications(userId).then(result => {
      res.status(200).json(result.rows);
    }).catch(err => next(err));
  } else {
    res.status(403).send('Forbidden');
  }
});


// TODO: should this even be a thing? Or should all notifications be generated
// as side effects from within the app's business logic?
router.post('/:uid', (req, res, next) => {
  const userId = req.pathUser.id;
  const { notifierId, postId, notificationType } = req.body;
  if (req.user.user_id === notifierId) {
    Notification.addUserNotification(userId, notifierId, postId, notificationType).then(result => {
      res.status(201).send({message: `created notification with id ${result.rows[0].id}`})
    }).catch(err => next(err));
  } else {
    res.status(403).send('Forbidden');
  }
});


router.put('/:uid', (req, res, next) => {
  if (isCurrUser(req)) {
    const notificationId = parseInt(req.query['notification_id']);
    Notification.markNotificationAsRead(notificationId).then(result => {
      res.status(200).send({message: `marked notification with id ${notificationId} as read`})
    }).catch(err => next(err));
  } else {
    res.status(403).send('Forbidden');
  }
});


router.delete('/:uid', (req, res, next) => {
  if (isCurrUser(req)) {
    const notificationId = parseInt(req.query['notification_id']);
    Notification.deleteNotification(notificationId).then(result => {
      res.status(200).send({message: `deleted notification with id ${notificationId}`});
    });
  } else {
    res.status(403).send('Forbidden');
  }
});

module.exports = router;

