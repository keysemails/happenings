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
      username: 'TEST_USER1',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe('user routes integration tests', () => {
  let TEST_AUTHENTICATED_USERNAME = 'TEST_USER1';
  let TEST_AUTH_USERID = 1;
  let TEST_OTHER_USRID = 2;

  describe('GET / users', () => {
    it('should be Unauthorized', (done) => {
      request(app).get(`/users/${TEST_AUTHENTICATED_USERNAME}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.text).to.equal('Unauthorized');
          done();
        });
    });
    it('should be authorized and respond with JSON', (done) => {
      request(app).get(`/users/${TEST_AUTHENTICATED_USERNAME}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0].email).to.be.equal('TEST_EMAIL1');
          expect(res.body[0].is_private).to.be.equal(false);
          done();
        });
    });
  });

  describe('PUT / users', () => {
    it('should be Unauthorized', (done) => {
      let OTHER_USERNAME = 'TEST_USER2';
      request(app).put(`/users/${OTHER_USERNAME}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.text).to.equal('Unauthorized');
          done();
        });
    });
    it('should update the user successfully', (done) => {
      request(app).put(`/users/${TEST_AUTH_USERID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          username: 'TEST_USER_1',
          email: 'TEST_EMAIL1',
          user_type: 'THING',
          bio: 'loves to chill',
          is_private: true
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message', 'user 1 updated.');
          done();
        });
    });
    it('should cause DB error if null vals sent to non-null fields', (done) => {
      request(app).put(`/users/${TEST_AUTH_USERID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          email: 'TEST_EMAIL1', // missing required user_type
          bio: 'loves to chill',
          is_private: true
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property('error', 'not null violation (missing some required field)');
          done();
        });
    });
  });

  describe('DELETE / users', () => {
    it('should not let you delete someone elses account', (done) => {
      request(app).delete(`/users/${TEST_OTHER_USRID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    });
    it('should let you delete your own account', (done) => {
      request(app).delete(`/users/${TEST_AUTH_USERID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message', 'user deleted');
          done();
        });
    });
  });
});

