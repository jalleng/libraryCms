'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

const PORT = process.env.PORT;

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleUser = {
  username: 'testName',
  password: 'testPassword'
};

describe('User routes', function() {
  describe('POST: /api/signup', function() {
    describe('with a valid user', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          console.log('Token: ', res.text);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });
  describe('GET: /api/signin', function() {
    describe('with a valid user', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          console.log( user, '*************');
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after( done => {
        User.remove({})
        .then ( () => done() )
        .catch(done);
        return;
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('testName', 'testPassword')
        .end((err, res) => {
          if (err) return done(err);
          console.log('\nuser:', this.tempUser);
          console.log('\ntoken:', res.text);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});




