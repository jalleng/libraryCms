'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Book = require('../model/book.js');
const Library = require('../model/library.js');
const User = require('../model/library.js');

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

const badLibrary = {
  flavor: 'reference',
  description: 'books for reference'
};

describe('Library Routes', function() {
  describe('POST: /api/library', function() {

    after( done => {
      if (this.tempLibrary) {
        Library.remove({})
        .then ( () => done() )
        .catch(done);
        return;
      }
      done();
    });

    describe('with a valid body', function() {
      it('should return a library', done => {
        request.post(`${url}/api/library`)
        .send(exampleLibrary)
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('reference');
          expect(res.body.description).to.equal('books for reference');
          this.tempLibrary = res.body;
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      it('should return 400 error', done => {
        request.post(`${url}/api/library`)
        .send(badLibrary)
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          done();
        });
      });
    });

    describe('with no body', function() {
      it('should return 400 error', done => {
        request.post(`${url}/api/library`)
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(err.message).to.equal('Bad Request');
          done();
        });
      });
    });

  });

  // describe('GET: /api/library', function() {
  //   before( done => {
  //     new Library(exampleLibrary).save()
  //     .then ( library => {
  //       this.library = library;
  //       done();
  //     })
  //     .catch(done);
  //   });

  //   describe('With a valid libraryID', function() {
  //     it('should return a library', done => {
  //       request.get(`${url}/api/library/${this.library._id}`)
  //       .end( (err, res) => {
  //         if (err) return done(err);
  //         expect(res.status).to.equal(200);
  //         done();
  //       });
  //     });
  //   });
  // });
});