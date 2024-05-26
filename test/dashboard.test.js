const request = require('request');
const expect = require('chai').expect;
const axios = require('axios');
const cookie = require('cookie');
const url = "http://localhost:3000/dashboard";

describe('Dashboard API Tests', function() {
  before(async function() {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        user_email: 'sample@example.com',
        user_password: 'password123'
      });
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        if (tokenCookie) {
          token = cookie.parse(tokenCookie).token;
        }
      }
      if (!token) {
        throw new Error('Token not found in login response');
      }
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      throw error;
    }
  });  

  describe('GET /dashboard/getAllNotifications', function() {
    it('should get all notifications', function(done) {
      request.get({
        url: url + '/getAllNotifications',
        headers: {
          'Cookie': 'token=' + token // Pass token as a cookie
        }
      }, function(error, response, body) {
        if (error) {
          return done(error);
        }
        body = JSON.parse(body);
        expect(body.message).to.be.equal("get all notifications success");
        expect(response.statusCode).to.equal(200);
        expect(body.data).to.not.equal(null);
        done();
      });
    });
  });

  describe('POST /dashboard/updateNotificationStatus', function() {
    const data = {
        notificationId: '6652d78eabe0d103a6c1865e',
        status: 'Taken'
    };

    it('should update the notification status', function(done) {
      request.post({
        url: url + '/updateNotificationStatus',
        headers: {
          'Cookie': 'token=' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }, function(error, response, body) {
        if (error) return done(error);
        const parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.be.equal("Notification updated successfully");
        generatedId = parsedBody.data;
        done();
      });
    });

  });

});
