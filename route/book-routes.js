'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('library:book-routes');

const Book = require('../model/book.js');
const Library = require('../model/library.js');
const User = require('../model/user.js');

const bookRouter = module.exports = new Router();

bookRouter.post('/api/book', jsonParser, function(req, res, next) {
  debug('POST: /api/book');

  if (Object.keys(req.body).length === 0) return next(createError(400, 'Expected Body'));

  new Book(req.body).save()
  .then( book => res.json(book))
  .catch( err => next(createError(400, err.message)));
});


bookRouter.get('/api/book/:bookID', function(req, res, next) {
  debug('GET: /api/book/:bookID');
  Book.findById(req.params.bookID)
  .then( book => res.json(book))
  .catch( err => next(createError(404, err.message)));
});


bookRouter.put('/api/book/:bookID', jsonParser, function(req, res, next) {
  debug('PUT: /api/book/:bookID');
  
  if (Object.keys(req.body).length === 0) return next(createError(400, 'invalid request body'));
  
  for (let prop in req.body) {
    if (!Book.schema.paths[prop]) return next(createError(400, 'invalid request body'));
  }

  Book.findByIdAndUpdate(req.params.bookID, req.body, {new: true})
  .then( book => res.json(book))
  .catch( err => next(createError(404, err.message)));
});


bookRouter.delete('/api/book/:bookID',  jsonParser, function(req, res, next) {
  debug('DELETE: /api/book/:bookID');
  Book.findByIdAndRemove(req.params.bookID)
  .then( () => res.status(204).send())
  .catch ( err => next(createError(404, err.message)));
});