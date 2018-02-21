// main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// db setup
mongoose.connect('mongodb://localhost/auth');
// note: I had to change the line from the lesson b/c mongodb wasn't connecting to my server otherwise for some reason

// app setup
app.use(morgan('combined'));
// 'morgan' is a logging framework. it logs in any incoming requests.
// we will be using 'morgan' for debugging
app.use(bodyParser.json({ type: '*/*' }));
// 'bodyParser is used to parse incoming requests, specifically into json

// 'morgan' and 'bodyParser' are considered to be 'middleware' in express
// middleware in express is something that any incoming request is going to be passed into
router(app);

// server setup
// to start the server: npm run dev
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);