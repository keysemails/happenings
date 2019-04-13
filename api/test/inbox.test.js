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
      username: 'TEST_USER3',
      password: 'TEST_PASSWORD',
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});


describe('inbox routes integration tests', () => {
  let TEST_USER3_ID = 3;
  let OTHER_USER_ID = 1;
  let EXPECTED_NOTIFICATION_ID = 1;
  describe('POST /inbox/:uid', () => {
    it('should succssfully create a notification', (done) => {
      request(app).post(`/inbox/${TEST_USER3_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          notifierId: TEST_USER3_ID,
          postId: 3,
          notificationType: 'INVITE_TO_EVENT',
          userId: OTHER_USER_ID
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property(
            'message', `created notification with id ${EXPECTED_NOTIFICATION_ID}`
          )
          done();
        });
    });
    it('should not allow creation of notification with discrepant notifierId', (done) => {
      request(app).post(`/inbox/${TEST_USER3_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({
          notifierId: OTHER_USER_ID,
          postId: 3,
          notificationType: 'INVITE_TO_EVENT',
          userId: TEST_USER3_ID
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });
  });

  describe('PUT /inbox/:uid mark as read', () => {
    it('should update the notification', (done) => {
      request(app).put(`/inbox/${TEST_USER3_ID}/?notification_id=${EXPECTED_NOTIFICATION_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .then(result => {
          request(app).get(`/inbox/${TEST_USER3_ID}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.be.an('array');
              expect(res.body[0]).to.have.property('read', true);
              done();
            });
        });
    });
  });

  describe('DELETE /inbox/:uid', () => {
    it('should delete the notification', (done) => {
      request(app).delete(`/inbox/${TEST_USER3_ID}/?notification_id=${EXPECTED_NOTIFICATION_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property(
            'message', `deleted notification with id ${EXPECTED_NOTIFICATION_ID}`
          );
          done();
        });
    });
    it('should not allow deletion', (done) => {
      request(app).delete(`/inbox/${OTHER_USER_ID}/?notification_id=${EXPECTED_NOTIFICATION_ID}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });
  });
});
