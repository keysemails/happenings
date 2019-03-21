const request = require('supertest');
const app = require('../index.js');
const { expect, assert } = require('chai');


/**
 * Login to test account to get a valid JWT
 * that we'll use to test protected routes
 */
let token;
beforeAll((done) => {
  request(app).post('/auth/login')
    .send({
      username: 'TEST_USER2',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe('followers routes integration tests', () => {
  let TEST_AUTH_USERID = 2;
  let TEST_AUTHENTICATED_USERNAME = 'TEST_USER2';

  let TEST_OTHER_USERID = 1;
  let TEST_OTHER_USERNAME = 'TEST_USER1';

  describe('POST /users/:uid/followers',  () => {
    // have user1 follow user2 and user3
    it('should be unauthorized without token', (done) => {
      const queryStr = `/users/${TEST_OTHER_USERID}/followers?follower_id=${TEST_AUTH_USERID}`;
      request(app).post(queryStr)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
    it('making someone else follow you should be unauthorized', (done) => {
      const queryStr = `/users/${TEST_AUTH_USERID}/followers?follower_id=${TEST_OTHER_USERID}`;
      request(app).post(queryStr)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
    it('should not be able to follow yourself', (done) => {
      const queryStr = `/users/${TEST_AUTH_USERID}/followers?follower_id=${TEST_AUTH_USERID}`;
      request(app).post(queryStr)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
    it('should successfully create the follow', (done) => {
      const queryStr = `/users/${TEST_OTHER_USERID}/followers?follower_id=${TEST_AUTH_USERID}`;
      request(app).post(queryStr)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('message', 'user 2 now following user 1');
          done();
        });
    });
  });

  describe('GET /users/:uid/followers', () => {
    it('should return empty list of followers', (done) => {
      request(app).get(`/users/${TEST_AUTH_USERID}/followers`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
          done();
        });
    });
    it('should return a list containing one follower', (done) => {
      request(app).get(`/users/${TEST_OTHER_USERID}/followers`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0].username).to.equal(TEST_AUTHENTICATED_USERNAME);
          done();
        });
    });
  });

  describe('GET /users/:uid/following', () => {
    it('should return empty list of followers', (done) => {
      request(app).get(`/users/${TEST_OTHER_USERID}/following`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
          done();
        });
    });
    it('should return a list containing one follower', (done) => {
      request(app).get(`/users/${TEST_AUTH_USERID}/following`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0].username).to.equal(TEST_OTHER_USERNAME);
          done();
        });
    });
  });

  describe('GET /users/:uid/follower_count', () => {
    it('should return the number 1', (done) => {
      request(app).get(`/users/${TEST_OTHER_USERID}/follower_count`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('follower_count', '1');
        done();
      })
    })
  })

  describe('GET /users/:uid/following_count', () => {
    it('should return the number 1', (done) => {
      request(app).get(`/users/${TEST_OTHER_USERID}/following_count`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('following_count', '0');
        done();
      })
    })
  })

  describe('DELETE /users/:uid/followers', () => {
    it('should not let you remove someone else from your followers', (done) => {
      request(app).delete(`/users/${TEST_AUTH_USERID}/followers?follower_id=${TEST_OTHER_USERID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
    it('should delete the follow', (done) => {
      request(app).delete(`/users/${TEST_OTHER_USERID}/followers?follower_id=${TEST_AUTH_USERID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property(
            'message', `user ${TEST_AUTH_USERID} no longer following user ${TEST_OTHER_USERID}`
          );
          done();
        });
    });
  })
});
