const request = require('supertest');
const app = require('../index.js');
const expect = require('chai').expect;

const { createFollow } = require('../queries/followers');
const { getMainFeed, getDiscoverFeed } = require('../queries/feed');

const TEST_FOLLOWED_UID = 8;
const TEST_FOLLOWER_UID = 6;
const ANOTHER_FOLLOWER_UID = 7;

let token;
beforeAll(async (done) => {
  await createFollow(TEST_FOLLOWED_UID, TEST_FOLLOWER_UID);
  await createFollow(TEST_FOLLOWED_UID, ANOTHER_FOLLOWER_UID);

  request(app).post('/auth/login')
    .send({
      username: 'TEST_INFLUENCER_8',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe('main feed fanout integration test', () => {
  describe('POST /posts,', () => {
    const createPostPayload = {
        user_id: TEST_FOLLOWED_UID,
        event_timestamp: 10000000,
        title: 'first event ever',
        description: 'ya',
        full_url: 'doesntmatter',
        full_storage_uri: 'idk',
        thumb_url: 'idk',
        thumb_storage_uri: 'idk',
        location: 'nyc',
        is_private: false,
        is_accessible: true,
        guests_can_invite: true,
        age_restriction: 'AGES_ALL'
    };
    it('should fan out the postID to two followers', (done) => {
      request(app).post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(createPostPayload)
        .end((err, res) => {
          let postId = res.body['post_id'];
          getMainFeed(TEST_FOLLOWER_UID).then(result => {
            expect(result.rows[0]['post_id']).to.equal(postId);
          });
          getMainFeed(ANOTHER_FOLLOWER_UID).then(result => {
            expect(result.rows[0]['post_id'].to.equal(postId));
          });
          done();
        });
    });
  });
});
