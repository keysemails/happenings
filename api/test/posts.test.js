const request = require('supertest');
const app = require('../index.js');
const expect = require('chai').expect;

describe('posts routes integration tests', () => {
  describe('#GET / posts', () => {
    it('should get one post', (done) => {
      let TEST_POST_ID = 5;
      request(app).get(`/posts/${TEST_POST_ID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        })
    })
  })
});