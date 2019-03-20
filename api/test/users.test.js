const request = require('supertest');
const app = require('../index.js');
const expect = require('chai').expect;

// const { createFakeData, cleanUpFakeData } = require('../util/test-setup');

/**
 * Login to test account to get a valid JWT
 */
let token;
beforeAll((done) => {
  request(app).post('/auth/login')
    .send({
      username: 'TEST_USER1',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      console.log(res.body);
      token = res.body.token;
      done();
    });
});

describe('user routes integration tests', () => {
  describe('GET / user', () => {
    let TEST_USERNAME = 'TEST_USER1';
    it('should be Unauthorized', (done) => {
      request(app).get(`/users/${TEST_USERNAME}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.text).to.equal('Unauthorized');
          done();
        });
    });
    it('should be authorized and respond with JSON', (done) => {
      request(app).get(`/users/${TEST_USERNAME}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(404);
          done();
        });
    });
  });
});

