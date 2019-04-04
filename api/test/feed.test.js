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

describe('main feed fanout integration tests', () => {
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
            expect(result.rows[0]['post_id']).to.equal(postId);
          });
          done();
        });
    });
  });
});


describe('discover feed fanout integration tests', () => {
  describe('POST /comments', () => {
    let TEST_POST_ID = 3;
    let DIFFERENT_PERSONS_POST_ID = 2;
    let YET_ANOTHER_POST_ID = 5;
    it('should create a comment and fan out activity to followers', (done) => {
      request(app).post(`/posts/${TEST_POST_ID}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          text: 'wow cool event wonder if my friends will ever hear about this lol'
        })
        .end(async (err, res) => {
          const expectedResponse = {
            post_id: TEST_POST_ID,
            followee_id: TEST_FOLLOWER_UID,
            activity_type: 'COMMENT',
            event_timestamp: '2001-09-09T01:46:40.000Z'
          };

          const res1 = await getDiscoverFeed(TEST_FOLLOWER_UID);
          expect(res1.rows[0]['post_id']).to.equal(TEST_POST_ID);
          expect(res1.rows[0]['followee_id']).to.equal(TEST_FOLLOWED_UID);

          const res2 = await getDiscoverFeed(ANOTHER_FOLLOWER_UID);
          expect(res2.rows[0]['post_id']).to.equal(TEST_POST_ID);
          expect(res2.rows[0]['followee_id']).to.equal(TEST_FOLLOWED_UID);

          done();
        });
    });

    it('should STAR a post and fan out activity to followers', (done) => {
      request(app).post(`/posts/${DIFFERENT_PERSONS_POST_ID}/stars`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send()
        .end(async (err, res) => {
          expectedPostIds = [TEST_POST_ID, DIFFERENT_PERSONS_POST_ID];

          const res1 = await getDiscoverFeed(TEST_FOLLOWER_UID);
          expect(res1.rows.map(r => r['post_id'])).to.have.members(expectedPostIds);

          const res2 = await getDiscoverFeed(ANOTHER_FOLLOWER_UID);
          expect(res2.rows.map(r => r['post_id'])).to.have.members(expectedPostIds);

          done();
        });
    });

    it('should ATTEND a post and fan out activity to followers', (done) => {
      request(app).post(`/attendance`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          userId: TEST_FOLLOWED_UID,
          postId: YET_ANOTHER_POST_ID
        })
        .end(async (err, res) => {
          expectedPostIds = [TEST_POST_ID, DIFFERENT_PERSONS_POST_ID, YET_ANOTHER_POST_ID];

          const res1 = await getDiscoverFeed(TEST_FOLLOWER_UID);
          expect(res1.rows.map(r => r['post_id'])).to.have.members(expectedPostIds);

          const res2 = await getDiscoverFeed(ANOTHER_FOLLOWER_UID);
          expect(res2.rows.map(r => r['post_id'])).to.have.members(expectedPostIds);

          done();
        });
    });
  });
});
