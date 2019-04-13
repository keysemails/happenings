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
  let TEST_POST_ID = 1;
  let PRIVATE_TEST_POST_ID = 5;
  let TEST_USER_ID = 1;
  describe('GET / public/posts', () => {
    it('should get one post without needing a token', (done) => {
      request(app).get(`/public/posts/${TEST_POST_ID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('username', 'TEST_USER1');
          done();
        });
    });
    it('should be unauthorized because post is private', (done) => {
      request(app).get(`/public/posts/${PRIVATE_TEST_POST_ID}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(403);
        done();
      })
    })
  });

  describe('GET /posts', () => {
    let TEST_POST_ID = 1;
    it('should be unauthorized', (done) => {
      request(app).get(`/posts/${TEST_POST_ID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    it('should return a post', (done) => {
      request(app).get(`/posts/${TEST_POST_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('username', 'TEST_USER1');
          done();
        });
    })
  });

  describe('PUT /posts', () => {
    const putPayload = {
      title: 'FUCK HIGH ART',
      description: 'leave ur shoes at home',
      location: 'bowery loft',
      event_timestamp: 1000000000,
      is_private: false,
      is_accessible: true,
      guests_can_invite: false,
      age_restriction: 'AGES_21'
    };
    it('should not let you update someone elses post', (done) => {
      request(app).put(`/posts/${PRIVATE_TEST_POST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(putPayload)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
    });
    it('should let you update your own post', (done) => {
      request(app).put(`/posts/${TEST_POST_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(putPayload)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
    });
  });

  describe('POST /posts', () => {
    const createPostPayload = {
        user_id: TEST_USER_ID,
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
    it('should not be possible to create post with user_id other than ur own', (done) => {
      request(app).post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send({...createPostPayload, user_id: 321})
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
    });
    it('should successfully create a post', (done) => {
      request(app).post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(createPostPayload)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        done();
      });
    });
  });

  describe('DELETE /posts', () => {
    it('should not be able to delete someone elses post', (done) => {
      request(app).delete(`/posts/${PRIVATE_TEST_POST_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        });
    })
    it('should let you delete your own post', (done) => {
      request(app).delete(`/posts/${TEST_POST_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message', 'deleted post with id 1');
          done();
        });
    });
  });
});