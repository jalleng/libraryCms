'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('library:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer');

  var authHeader = req.headers.authorization;
  if(!authHeader) {
    return next(createError(401, 'authorization required'));
  }

  var token = authHeader.split('Bearer ')[1];

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(err);

    User.findone({ findHash: decoded})
    .then( user => {
      req.user = user;
      next();
    })
    .catch( err => {
      next(createError(401, err.message));
    });
  });
};