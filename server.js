'use strict';

const express = require('express'); 
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Promise = require('bluebird');
const debug = require('debug')('library:server.js');

const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/note';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();

app.use(cors);
app.use(morgan('dev'));


app.use(errors);

app.listen(PORT, () => {
  debug(`Cthulhu awakened on port: ${PORT}`);
});


