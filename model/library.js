'use strict'; 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('library:library');

const librarySchema = Schema({
  name: {type: String, required: true},
  description: {type: String, required: false},
  books: [{type: Schema.Types.ObjectId, ref: 'book'}]
});

const Library = module.exports = mongoose.model('library', librarySchema);