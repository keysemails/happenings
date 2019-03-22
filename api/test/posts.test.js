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
      username: 'TEST_USER1',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});


describe('posts routes integration tests', () => {
  describe('GET / posts', () => {
    it('should get one post without needing a token', (done) => {
      let TEST_POST_ID = 1;
      request(app).get(`/posts/${TEST_POST_ID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('username', 'TEST_USER1');
          done();
        })
    })
  })
});