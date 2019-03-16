const express = require('express');
const Posts = require('../queries/posts');
const Comments = require('../queries/comments');
const { FOREIGN_KEY_VIOLATION } = require('pg-error-constants');

const router = express.Router();


router.post('/', (req, res) => {
  const postData = req.body;
  Posts.createPost(postData).then(postId => {
    res.status(201).send({message: `created post with id ${postId}`})
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


router.put('/:post_id', (req, res) => {
  const postId = parseInt(req.params.post_id);
  const postData = req.body;
  Posts.updatePost(postId, postData).then(result => {
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(201).send(`updated post with id ${postId}`)
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


router.delete('/:post_id', (req, res) => {
  const postId = parseInt(req.params.post_id);
  Posts.deletePost(postId).then(result => {
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(200).send(`deleted post with id ${postId}`)
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


router.get('/:post_id', (req, res) => {
  const postId = parseInt(req.params['post_id']);
  Posts.getPost(postId).then(result => {
    if (result.length === 0) {
      return res.status(404).send({error: 'post not found'})
    }
    res.status(200).send(result)
  }).catch(err => {
    console.error(err);
    res.status(500);
  });
});


/** 
 * COMMENTS COMMENTS COMMENTS COMMENTS
 */

router.get('/:post_id/comments', (req, res) => {
  const postId = parseInt(req.params['post_id']);
  Comments.getPostComments(postId).then(result => {
    res.status(200).send(result.rows)
  }).catch(err => {
    console.error(err);
    if (err.code == FOREIGN_KEY_VIOLATION) {
      return res.status(400).send({error: 'post_id not found'})
    }
    res.status(500);
  });
});


router.post('/:post_id/comments', (req, res) => {
  const postId = parseInt(req.params['post_id']);
  console.log('postid', postId);
  const { user_id, text } = req.body;
  Comments.addPostComment(postId, user_id, text).then(result => {
    response.status(201).send({message: `created comment with id ${result}`})
  }).catch(err => {
    console.error(err);
    if (err.code == FOREIGN_KEY_VIOLATION) {
      return res.status(400).send({error: 'post_id not found'})
    }
    res.status(500);
  })
});


router.delete('/:post_id/comments', (req, res) => {
  const postId = parseInt(req.params['post_id']);
  const commentId = parseInt(req.query['comment_id']);
  Comments.deletePostComment(postId, commentId).then(() => {
    res.status(200).send({message: 'comment deleted'});
  }).catch(err => {
    res.status(500);
  });
})

module.exports = router;
