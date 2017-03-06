'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('library:user');

const userSchema = Schema({
  name: {type: String, required: true},
  libraryList: [{type: Schema.Types.ObjectId, ref:'library'}],
  bookList: [{type: Schema.Types.ObjectId, ref:'book'}]
});

const User = module.exports = mongoose.model('user', userSchema);