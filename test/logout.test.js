const request = require('request');
const expect = require('chai').expect;
const axios = require('axios');
const cookie = require('cookie');
const url = "http://localhost:3000/auth";
let token;

describe('Auth API Tests', function() {
  before(async function() {
    try {
      const response = await axios.post(url + '/login', {
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

  describe('POST /logout', function() {
    it('should logout a user successfully', function(done) {
      request.post({
        url: url + '/logout',
        headers: {
          'Cookie': 'token=' + token,
          'Content-Type': 'application/json'
        }
      }, function(error, response, body) {
        if (error) return done(error);
        const parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.be.equal('Logout successful');
        done();
      });
    });
  });
});
