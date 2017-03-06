'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('library:book');

const bookSchema = Schema({
  isbn: {type: Number, required: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  location: {type: String, required: false},
  status: {type: String, required: false},
  libraryID: {type: Schema.Types.ObjectId, required: false}
});

module.exports = mongoose.module('book', bookSchema);