const request = require('request');
const expect = require('chai').expect;
const axios = require('axios');
const cookie = require('cookie');
const url = "http://localhost:3000/medManager";

let token; 
let generatedId;

describe('MedManager API Tests', function() {
  before(async function() {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        user_email: 'sample@example.com',
        user_password: 'password123'
      });
      const cookies = response.headers['set-cookie'];
      header = response.headers; // Assigning to the global variable header
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

  describe('GET /medManager/getMeds', function() {
    it('should get all medications', function(done) {
      request.get({
        url: url + '/getMeds',
        headers: {
          'Cookie': 'token=' + token // Pass token as a cookie
        }
      }, function(error, response, body) {
        if (error) {
          return done(error);
        }
        body = JSON.parse(body);
        expect(body.message).to.be.equal("get all meds success");
        expect(response.statusCode).to.equal(200);
        expect(body.data).to.not.equal(null);
        done();
      });
    });
  });

  describe('POST /medManager/addMed', function() {
    const newMed = {
      medication_name: 'Test Med',
      dosage: '100mg',
      frequency: 'Once a day',
      time1: '09:00',
      time2: '',
      time3: '',
      time4: '',
      start_date: '2024-05-25', // Ensure date format matches expected format
      end_date: '2024-05-26'
    };

    it('should create a new medication', function(done) {
      request.post({
        url: url + '/addMed',
        headers: {
          'Cookie': 'token=' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMed)
      }, function(error, response, body) {
        if (error) return done(error);
        const parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.be.equal("Medication created successfully");
        generatedId = parsedBody.data;
        console.log('generated inside id: ' + generatedId);

        done();
      });
    });

  });

  describe('POST /medManager/editMed', function() {
    it('should edit a new medication', function(done) {
      console.log('generated id: ' + generatedId);
      const newMed = {
        _id: generatedId,
        medication_name: 'Test Med',
        dosage: '100mg',
        frequency: 'Once a day',
        time1: '10:00',
        time2: '',
        time3: '',
        time4: '',
        start_date: '2024-05-25', // Ensure date format matches expected format
        end_date: '2024-05-26'
      };
      request.post({
        url: url + '/editMed',
        headers: {
          'Cookie': 'token=' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMed)
      }, function(error, response, body) {
        if (error) return done(error);
        const parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.be.equal("Medication updated successfully");
        done();
      });
    });

  });

  describe('POST /medManager/deleteMed', function() {
    it('should delete a new medication', function(done) {
      const body = {
        _id: generatedId
      };
      request.post({
        url: url + '/deleteMed',
        headers: {
          'Cookie': 'token=' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }, function(error, response, body) {
        if (error) return done(error);
        const parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.be.equal("Medication deleted successfully");
        done();
      });
    });

  });

});
