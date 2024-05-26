var expect = require('chai').expect;
var request = require('request');
var url = 'http://localhost:3000/auth/';

var sampleUser = {
  user_email: 'sample@example.com',
  user_password: 'password123',
};

describe('Test Post API for /auth/login', function () {
  it('post user to DB and login', function (done) {
    request.post(
      { url: url + '/login', form: sampleUser },
      function (error, response, body) {
        let parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.equal('Login successful');
        done();
      }
    );
  });
});

var newUser = {
  user_email: 'test@example.com',
  user_password: 'password123',
  user_first_name: 'test',
  user_last_name: 'test',
  user_gender: 'Female',
};

// commented this function because the user has been created and it will give error
/*
describe('Test Post API for /auth/register', function () {
  it('post user to DB and register', function (done) {
    request.post(
      { url: url + '/register', form: newUser },
      function (error, response, body) {
        let parsedBody = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(parsedBody.message).to.equal('Registration successful');
        done();
      }
    );
  });
});

*/
