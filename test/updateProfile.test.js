const request = require('request');
const expect = require('chai').expect;
const axios = require('axios');
const cookie = require('cookie');
const bcrypt = require('bcryptjs'); // Add bcrypt for hashing
const url = "http://localhost:3000/profile";
let token;

describe('Profile API Tests', function() {
  before(async function() {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        user_email: 'socketuser@test.mail',
        user_password: 'pass123'
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

  describe('POST /profile/updateprofile', function() {
    it('should update the profile successfully', async function() {
      const data = {
        user_first_name: 'Mane',
        user_last_name: 'Doe',
        user_email: 'profileuser@test1.mail',
        user_password: 'pass1234'
      };

      // Hash the password before sending it
      const hashedPassword = await bcrypt.hash(data.user_password, 10);
      data.user_password = hashedPassword;

      request.post({
        url: url + '/updateprofile',
        headers: {
          'Cookie': 'token=' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }, function(error, response, body) {
        if (error) return done(error);
        const parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.be.equal('Profile updated successfully');
        
      });
    });
  });
});
