'use strict';

const createError = require('http-errors');
const debug = require('debug')('library:basic-auth-middleware');

module.exports = function(req, res, next) {
  debug('basic');

  var authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'authorizaion required'));
  }

  var encodedString = authHeader.split('Basic ')[1];
  if (!encodedString) {
    return next(createError(401, 'username and password required'));
  }

  var decodedString = new Buffer(encodedString, 'base64').toString();
  var authArray = decodedString.split(':');

  req.auth= {
    username: authArray[0],
    password: authArray[1]
  };

  if (!req.auth.username) {
    return next(createError(401, 'username required'));
  }

  if (!req.auth.password) {
    return next(createError(401, 'password required'));
  }

  next();
};