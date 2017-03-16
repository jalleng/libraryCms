'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Book = require('../model/book.js');
const Library = require('../model/library.js');
const User = require('../model/user.js');

const PORT = process.env.PORT;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleBook = {
  isbn: '12345',
  title: 'wat title',
  author: 'wat author',
  location: 'somewhere',
  status: 'on loan'
};

const exampleLibrary = {
  name: 'reference',
  description: 'books for reference'
};

describe('Book Routes', function() {
  describe('POST: /api/book', function() {
    describe('with a valid body', function() {
      after( done => {
        if (this.tempBook) {
          Book.remove({})
          .then ( () => done() )
          .cathc(done);
          return;
        }
        done();
      });

      it('should return a book', done => {
        request.post(`${url}/api/book`)
        .send(exampleBook)
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.body.title).to.equal('wat title');
          done();
        });
      });
    });
  });
});