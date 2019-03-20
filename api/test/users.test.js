const request = require('supertest');
const app = require('../index.js');
const expect = require('chai').expect;

describe('user routes integration tests', () => {
  describe('#GET / user', () => {
    let TEST_USERNAME = 'testboy';
    it('should be Unauthorized', (done) => {
      request(app).get(`/users/${TEST_USERNAME}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.text).to.equal('Unauthorized');
          done();
        });
    })
  })
});