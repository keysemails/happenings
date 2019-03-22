const express = require('express');
const getPost = require('../queries/posts').getPost;

const router = express.Router();

require('../middleware/params')(router);

router.get('/posts/:post_id', (req, res, next) => {
  if (req.post.is_private === false) {
    return res.status(200).send(req.post);
  }
  return res.status(403).send('Private Event');
});

module.exports = router;
