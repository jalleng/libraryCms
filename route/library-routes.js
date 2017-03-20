'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('library:library-routes');

// const Book = require('../model/book.js');
const Library = require('../model/library.js');
// const User = require('../model/user.js');

const libraryRouter = module.exports = new Router();

libraryRouter.post('/api/library', jsonParser, function(req, res, next) {
  debug('POST: /api/library');

  new Library(req.body).save()
  .then( library => res.json(library))
  .catch( err => next(createError(400, err.message)));
});