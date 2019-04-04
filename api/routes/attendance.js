const express = require('express');
const AttendanceService = require('../queries/attendance');
const { discoverFeedFanout } = require('../queries/feed');
const { ACTIVITY_TYPES } = require('../util/constants');

const asyncWrap = require('../middleware/wrap');

const router = express.Router({mergeParams: true});

/**
 * pass router through param middlewares to do post lookup
 * and 404 handling for all routes with 'post_id' param
 */
require('../middleware/params')(router);

/**
 * Returns a list of post ids in chronological order
 */
router.get('/user/:uid/alltime', (req, res, next) => {
  AttendanceService.getUserAttendance(
    req.pathUser.id
  ).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});


/**
 * Returns a list of post_ids for events that are upcoming
 * in chronological order
 */
router.get('/user/:uid/upcoming', (req, res, next) => {
  AttendanceService.getUserAttendanceUpcoming(
    req.pathUser.id
  ).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});


/**
 * Returns a list of post_ids for events that happened already
 * in reverse chronological order (most recent past event first)
 */
router.get('/user/:uid/past', (req, res, next) => {
  AttendanceService.getUserAttendancePast(
    req.pathUser.id
  ).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});


/**
 * Returns a list of (user_id, username)
 */
router.get('/post/:post_id', (req, res, next) => {
  AttendanceService.getPostAttendance(
    req.post.id
  ).then(result => {
    res.status(200).json(result.rows)
  }).catch(err => next(err));
});

/**
 * returns { attendance_count: 'int_as_string' }
 */
router.get('/post/:post_id/count', (req, res, next) => {
  AttendanceService.getPostAttendanceCount(
    req.post.id
  ).then(result => {
    res.status(200).json(result.rows[0])
  }).catch(err => next(err));
});


const _queryParamHelper = (req) => {
  const userId = parseInt(req.query['user_id']);
  const postId = parseInt(req.query['post_id']);
  const isCurrUser = (userId === req.user.user_id);
  return { userId, postId, isCurrUser };
}


router.post('/', asyncWrap(async (req, res, next) => {
  const { userId, postId } = req.body;
  const isCurrUser = (userId === req.user.user_id);
  if (isCurrUser) {
    Promise.all([
      AttendanceService.attendEvent(userId, postId),
      discoverFeedFanout(userId, postId, ACTIVITY_TYPES.ATTEND)
    ]).then(() => res.status(201).send(
      {message: `user ${userId} now attending post ${postId}`}
    ))
  } else {
    res.status(403).send('Forbidden');
  }
}));


router.delete('/', (req, res, next) => {
  const { userId, postId, isCurrUser } = _queryParamHelper(req);
  if (isCurrUser) {
    AttendanceService.removeAttendance(userId, postId).then(result => {
      res.status(200).send(
        {message: `user ${userId} no longer attending post ${postId}`}
      )
    }).catch(err => next(err));
  } else {
    res.status(403).send('Forbidden');
  }
});


module.exports = router;
