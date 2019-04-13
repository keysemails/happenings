const express = require('express');
const ActivityService = require('../queries/activity');

const router = express.Router();

/**
 * pass router through param middlewares to do post lookup
 * and 404 handling for all routes with 'post_id' param
 */
require('../middleware/params')(router);

/**
 * Gets called every time a user comments, likes, or attends an event.
 * This information is used to populate the discover feeds
 * of said user's followers.
 */
router.post('/:uid', (req, res, next) => {
  const pathUid = req.pathUser.id;
  const userId = req.user.user_id;
  if (pathUid === userId) {
    const { post_id, activity_type } = req.body;
    ActivityService.recordUserActivity(
      userId, post_id, activity_type
      ).then(result => {
        res.status(201).send({message: 'recorded user activity'})
      }).catch(err => next(err));
  } else {
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
