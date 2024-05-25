var expect = require('chai').expect;
var request = require('request');
var url = 'http://localhost:3000/auth/login';

var sampleUser = {
  user_email: 'sample@example.com',
  user_password: 'password123',
};

describe('Test Post API for /auth/login', function () {
  it('post user to DB and login', function (done) {
    request.post(
      { url: url, form: sampleUser },
      function (error, response, body) {
        let parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.equal('Login successful');
        done();
      }
    );
  });
});
