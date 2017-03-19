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

const updatedBook = {
  status: 'in house'
};

const badBook = {
  isbn: '54321',
  name: 'wat name'
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
          .catch(done);
          return;
        }
        done();
      });

      it('should return a book', done => {
        request.post(`${url}/api/book`)
        .send(exampleBook)
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status);
          expect(res.body.title).to.equal('wat title');
          this.tempBook = res.body;
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      it('should throw a 400 error', done => {
        request.post(`${url}/api/book`)
        .send(badBook)
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          done();
        });
      });
    });

    describe('with no body', function() {
      it('should throw a 400 error', done => {
        request.post(`${url}/api/book`)
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          done();
        });
      });
    });
  });

  describe('routes that require a book in the db', function() {
    before( done => {
      new Book(exampleBook).save()
      .then ( book => {
        this.book = book;
        done();
      })
      .catch(done);
    });

    describe('GET: /api/book/:bookID', () => {
      describe('with a valid bookID', () => {
        it('should return a book', done => {
          request.get(`${url}/api/book/${this.book._id}`)
          .end( (err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.isbn).to.equal(12345);
            done();
          });
        });
      });

      describe('with an invalid bookID', () => {
        it('should return a 404 error', done => {
          request.get(`${url}/api/book/123456`)
          .end( (err, res) => {
            expect(res.status).to.equal(404);
            expect(err.message).to.equal('Not Found');
            done();
          });
        });
      });
    });

    describe('PUT: /api/book/:bookID', () => {
      describe('with a valid body', () => {
        it('should return an updated book', done => {
          request.put(`${url}/api/book/${this.book._id}`)
          .send(updatedBook)
          .end( (err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('in house');
            done();
          });
        });
      });

      describe('with an invalid body', () => {
        it('should return a 400 error', done => {
          request.put(`${url}/api/book/${this.book._id}`)
          .send(badBook)
          .end( (err, res) => {
            expect(err.status).to.equal(400);
            expect(res.text).to.equal('invalid request body');
            done();
          });
        });
      });

      describe('with a missing body', () => {
        it('should return a 400 error', done => {
          request.put(`${url}/api/book/${this.book._id}`)
          .end( (err, res) => {
            expect(err.status).to.equal(400);
            expect(res.text).to.equal('invalid request body');
            done();
          });
        });
      });

      describe('wth an invaild bookID', () => {
        it('should return a 404 error', done => {
          request.put(`${url}/api/book/12345`)
          .send(updatedBook)
          .end( (err, res) => {
            expect(err.status).to.equal(404);
            expect(err.message).to.equal('Not Found');
            done();
          });
        });
      });
    });

    describe('DELETE: /api/book/:bookID', () => {
      describe('with an invalid bookID',  () => {
        it('should retun a 404 error', done => {
          request.delete(`${url}/api/book/12345`)
          .end( (err,res) => {
            expect(err.status).to.equal(404);
            expect(err.message).to.equal('Not Found');
            done();
          });
        });
      });


      describe('With a valid bookID', () => {
        it('should return a 204 status code', done => {
          request.delete(`${url}/api/book/${this.book._id}`)
          .end( (err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(204);
            done();
          });
        });
      });
    });
  });
});