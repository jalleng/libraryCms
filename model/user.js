'use strict';

const debug = require('debug')('library:user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true},
  libraryList: [{type: Schema.Types.ObjectId, ref:'library'}],
  bookList: [{type: Schema.Types.ObjectId, ref:'book'}]
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generatePasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash; 
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');
 console.log('password---->>', password);
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function() {
  debug('generateFindHash');

  return new Promise((resolve, reject) => {
    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch( err => {
        return reject(err);
      });
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');

  return new Promise((resolve, reject) => {
    this.generateFindHash()
    .then(findHash => resolve(jwt.sign({ token: findHash}, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};

userSchema.methods.nullCheck = function(user) {
  return new Promise((resolve, reject) => {
    if (user === null) return reject(createError(400, 'invalid username or password'));
    resolve(this);
  }); 
};

module.exports = mongoose.model('user', userSchema);