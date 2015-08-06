/*
|--------------------------------------------------------------------------
| Basic Setup
|--------------------------------------------------------------------------
*/

var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3000;

/*
|--------------------------------------------------------------------------
| Database Connection with Mongoose
|--------------------------------------------------------------------------
*/
mongoose.connect('mongodb://localhost/hoveyfamilyphotos');

/*
|--------------------------------------------------------------------------
| Various Middleware
|--------------------------------------------------------------------------
*/

// BodyParser for handling JSON bodies in POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Morgan to log requests to the console
app.use(morgan('dev'));


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

// Base route
router.get('/', function(req, res) {
  res.json({ message: 'Good stuff! You have reached the base endpoint for the API.' });
});

// Model-based routes stored in controllers
app.use('/photos', require('./controllers/photos'));

// Register routes
app.use('/', router);

/*
|--------------------------------------------------------------------------
| Start the server!
|--------------------------------------------------------------------------
*/

var server = app.listen(port, function() {

  var host = server.address().address;
  console.log('Example app listening at http://%s:%s', host, port);

});