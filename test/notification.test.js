const request = require('request');
const expect = require('chai').expect;
const axios = require('axios');
const cookie = require('cookie');
const url = "http://localhost:3000";

let token;

describe('Notifications API Tests', function() {
  before(async function() {
    try {
      const response = await axios.post(url + '/auth/login', {
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

  describe('GET /notify', function() {
    it('should fetch all notifications for the user', function(done) {
      request.get({
        url: url + '/notify',
        headers: {
          'Cookie': 'token=' + token // Pass token as a cookie
        }
      }, function(error, response, body) {
        if (error) {
          return done(error);
        }       

        try {
          body = JSON.parse(body);
          expect(response.statusCode).to.equal(200);
          expect(body.notifications).to.be.an('array');
          expect(body.notifications).to.have.lengthOf.at.least(1);
          done();
        } catch (parseError) {
          done(parseError);
        }
      });
    });
  });
});
