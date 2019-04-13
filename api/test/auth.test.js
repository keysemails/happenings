const request = require('supertest');
const app = require('../index.js');
const { expect, assert } = require('chai');

describe('authentication integration tests', () => {
  let TEST_USERNAME = 'NEW_ACCOUNT_NAME';
  let TEST_PASSWORD = 'P@SSW0RD';
  let TEST_EMAIL = 'ZUCK@FACEBOOK.COM';

  describe('POST / auth/register', () => {
    it('should create new user successfully', (done) => {
      request(app).post(`/auth/register`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          username: TEST_USERNAME,
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('username', TEST_USERNAME);
          done();
        });
    });
    it('should say username is already taken', (done) => {
      request(app).post(`/auth/register`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({
          username: TEST_USERNAME,
          email: TEST_EMAIL,
          password: TEST_PASSWORD
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.have.property(
            'error', 'unique violation (something with same value already exists)'
          );
          done();
        });
    });

    describe('POST auth/login', () => {
      it('should log in and return a cookie', (done) => {
        request(app).post(`/auth/login`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send({
            username: TEST_USERNAME,
            password: TEST_PASSWORD
          })
          .expect(200)
          .expect('set-cookie')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('token');
            done();
          });
      });
      it('should not log in with bad creds', (done) => {
        request(app).post(`/auth/login`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send({
            username: TEST_USERNAME,
            password: 'I_FORGOT'
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property(
              'error', 'username and/or password incorrect'
            );
            done();
          });
      });
    })
  });
});
