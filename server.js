'use strict';

const express = require('express'); 
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('library:server.js');

const bookRouter = require('./route/book-routes.js');
const libraryRouter = require('./route/library-routes.js');
const authRouter = require('./route/auth-routes.js');


const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

let morganFormat = process.env.PRODUCTION ? 'common' : 'dev';


// app.use('/', function (req, res, next) {
//   res.send('Cthulu has awoke!');
// });

app.use(cors());
app.use(morgan(morganFormat));

app.use(authRouter);
app.use(bookRouter);
app.use(libraryRouter);

app.use(errors);



app.listen(PORT, () => {
  debug(`Cthulhu awakened on port: ${PORT}`);
  console.log(`Cthulhu awakened on port: ${PORT}`);
});


