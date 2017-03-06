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
  new Book(req.body).save()
  .then( book => res.json(book))
  .catch( err => next(createError(400, err.message)));
});


bookRouter.get('/api/book/:id', function(req, res, next) {
  debug('GET: /api/book/:id');
  Book.findById(req.params.id)
  .then( book => res.json(book))
  .catch( err => next(createError(404, err.message)));
});


bookRouter.put('/api/book/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/book/:id');
  Book.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( book => res.json(book))
  .catch( err => next(createError(404, err.message)));
});


bookRouter.delete('/api/book/:id',  jsonParser, function(req, res, next) {
  debug('DELETE: /api/book/:id');
  Book.findByIdAndRemove(req.params.Id)
  .then( () => res.status(204).send())
  .catch ( err => next(createError(404, err.message)));
});