const request = require('request');
const expect = require('chai').expect;
const axios = require('axios');
const cookie = require('cookie');
const url = "http://localhost:3000/forgotPassword";

describe('ForgotPassword API Tests', function() {

    // commented this function because it will send email every time we run it
    /*
    describe('POST /forgotPassword/sendEmail', function() {
        it('should send a forgot password email', function(done) {
        this.timeout(5000); // Set timeout to 5 seconds

        const email = { email: 'sample@example.com' };

        request.post({
            url: url + '/sendEmail',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        }, function(error, response, body) {
            if (error) {
            return done(error);
            }
            
            try {
            body = JSON.parse(body);
            expect(body.message).to.be.equal("Email sent successfully");
            expect(response.statusCode).to.equal(200);
            done();
            } catch (e) {
            done(new Error('Failed to parse JSON response: ' + e.message));
            }
        });
        });
    });
    */

    

});
