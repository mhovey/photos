/*
|--------------------------------------------------------------------------
| Basic Setup
|--------------------------------------------------------------------------
*/

var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var morgan         = require('morgan');
var _              = require('underscore');
var methodOverride = require('method-override');
var Schema         = mongoose.Schema;
var app            = express();
var router         = express.Router();
var port           = process.env.PORT || 3000;
var restify        = require('express-restify-mongoose');
var apiVersion     = '/v1';

/*
|--------------------------------------------------------------------------
| Import Models
|--------------------------------------------------------------------------
*/

var User    = require('./models/user');
var Photo   = require('./models/photo');
var Gallery = require('./models/gallery');
var Tag     = require('./models/tag');

/*
|--------------------------------------------------------------------------
| Database Connection with Mongoose
|--------------------------------------------------------------------------
*/

mongoose.connect('mongodb://localhost/hoveyfamilyphotos');

/*
|--------------------------------------------------------------------------
| Configure the App
|--------------------------------------------------------------------------
*/

// BodyParser for handling JSON bodies in POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// Morgan to log requests to the console
app.use(morgan('dev'));

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();

});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

// Base route
router.get('/'+apiVersion, function(req, res) {
  res.json({ message: 'Good stuff! You have reached the base endpoint for the API.' });
});

// Define Restify options
var restifyOptions = {
  prefix: '',
  version: apiVersion,
  lowercase: true,
  plural: true
};

// Set up routes for models with restify
restify.serve(router, Photo, restifyOptions);
restify.serve(router, Gallery, restifyOptions);
restify.serve(router, Tag, restifyOptions);
app.use(router);

/*
|--------------------------------------------------------------------------
| Start the server!
|--------------------------------------------------------------------------
*/

var server = app.listen(port, function() {

  var host = server.address().address;
  console.log('Example app listening at http://%s:%s', host, port);

});