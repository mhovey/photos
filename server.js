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

var Photo = require('./models/photo');

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