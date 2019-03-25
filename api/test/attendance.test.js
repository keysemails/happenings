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
      username: 'TEST_USER2',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});


describe('attendance routes integration tests', () => {
  /**
   * this post has an event_timestamp from like 2001
   * so we can use this to test the '/attendance/user/upcoming'
   * and 'attendance/user/past' routes
   */
  let TEST_POST_ID = 2;
  let TEST_USER_ID = 2;
  let OTHER_USER_ID = 3;
  describe('POST /attendance/', () => {
    it('should return one postId', (done) => {
      request(app).post('/attendance')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          userId: TEST_USER_ID,
          postId: TEST_POST_ID
        })
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('message', 'user 2 now attending post 2');
          done();
        });
    });
    it('should not let you make someone else attend an event', (done) => {
      request(app).post('/attendance')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          userId: OTHER_USER_ID,
          postId: TEST_POST_ID
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });
  });

  describe('GET /attendance/user routes', () => {
    it('should return one postId', (done) => {
      request(app).get(`/attendance/user/${TEST_USER_ID}/alltime`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('post_id', 2);
          done();
        });
    });
    it('should return one postId', (done) => {
      request(app).get(`/attendance/user/${TEST_USER_ID}/past`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('post_id', 2);
          done();
        });
    });
    it('should return an empty array', (done) => {
      request(app).get(`/attendance/user/${TEST_USER_ID}/upcoming`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(0);
          done();
        });
    });
  });

  describe('GET /attendance/post/:post_id', () => {
    it('should get one attending user', (done) => {
      request(app).get(`/attendance/post/${TEST_POST_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('username', 'TEST_USER2');
          expect(res.body[0]).to.have.property('user_id', 2);
          done();
        });
    });
  });

  describe('GET /attendance/post/:post_id/count', () => {
    it('should get a count of 1', (done) => {
      request(app).get(`/attendance/post/${TEST_POST_ID}/count`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          // node-postgres returns 'select count()' as string
          // https://github.com/brianc/node-postgres/issues/378
          expect(res.body).to.have.property('attendance_count', '1');
          done();
        });
    });
  });

  describe('DELETE /attendance', () => {
    it('should successfully remove user2s attendance', (done) => {
      request(app).delete(`/attendance?user_id=${TEST_USER_ID}&post_id=${TEST_POST_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message', 'user 2 no longer attending post 2');
          done();
        });
    });
  });
});
