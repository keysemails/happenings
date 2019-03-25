const request = require('supertest');
const app = require('../index.js');
const expect = require('chai').expect;

/**
 * Login to test account to get a valid JWT
 */
let token;
beforeAll((done) => {
  request(app).post('/auth/login')
    .send({
      username: 'DISCOVER_TEST',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe('activity post route integration test', () => {
  let DISCOVER_TEST_ID = 5;
  let OTHER_PERSON_ID = 1;
  let TEST_ID_OF_POST_TO_LIKE = 3;
  describe('POST /activity/:uid', () => {
    it('should successfully record user activity', (done) => {
      request(app).post(`/activity/${DISCOVER_TEST_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          post_id: TEST_ID_OF_POST_TO_LIKE,
          activity_type: 'LIKE'
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        })
    });
    it('should not let you record activity for someone else', (done) => {
      request(app).post(`/activity/${OTHER_PERSON_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          post_id: TEST_ID_OF_POST_TO_LIKE,
          activity_type: 'LIKE'
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        })
    });
  });
});