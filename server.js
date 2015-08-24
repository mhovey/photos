/*
|--------------------------------------------------------------------------
| Dotenv setup to bring in the application config
|--------------------------------------------------------------------------
*/

require('dotenv').load();

/*
|--------------------------------------------------------------------------
| Basic Setup
|--------------------------------------------------------------------------
*/

var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var _ = require('underscore');
var methodOverride = require('method-override');
var Schema = mongoose.Schema;
var router = express.Router();
var restify = require('express-restify-mongoose');
var apiPrefix = '/api';
var apiVersion = '/v1';

/*
|--------------------------------------------------------------------------
| Import Models
|--------------------------------------------------------------------------
*/

var User = require('./models/user');
var Photo = require('./models/photo');
var Gallery = require('./models/gallery');
var Tag = require('./models/tag');

/*
|--------------------------------------------------------------------------
| Database Connection with Mongoose
|--------------------------------------------------------------------------
*/

mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS
});

/*
|--------------------------------------------------------------------------
| Configure the App
|--------------------------------------------------------------------------
*/

app.engine('handlebars', exphbs({
  defaultLayout: 'master'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({
  secret: 'test',
  saveUninitialized: false,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('dev'));
app.use(router);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

// Add headers
app.use(function(req, res, next) {

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

// Clean up flash messages
app.use(function(req, res, next) {

  res.locals.success = req.flash('success');
  res.locals.errors = req.flash('error');

  // Pass to next layer of middleware
  next();

});

/*
|--------------------------------------------------------------------------
| One-time setup stuff that can be removed later on
|--------------------------------------------------------------------------
*/

app.get('/setup', function(req, res, next) {

  // Encrypt user passwords
  User.find({}, function(err, users) {

    _.each(users, function(user) {
      user.password = process.env.TEMP_PASS;
      user.save();
    });

    req.flash('success', 'Setup processed!');
    res.redirect('/login');

  });

});

/*
|--------------------------------------------------------------------------
| Passport Config
|--------------------------------------------------------------------------
*/

// Serialize the user session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

require('./config/passport')(passport);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Base route
router.get(apiPrefix + apiVersion, function(req, res) {
  res.json({
    message: 'Good stuff! You have reached the base endpoint for the API.'
  });
});

// Define Restify options
var restifyOptions = {
  prefix: apiPrefix,
  version: apiVersion,
  lowercase: true,
  plural: true
};

// Set up routes for models with restify
restify.serve(router, Photo, restifyOptions);
restify.serve(router, Gallery, restifyOptions);
restify.serve(router, Tag, restifyOptions);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Define a middleware used to protect authenticated routes
function isAuthenticated(req, res, next) {

  // Check for a user in the current session
  if (req.user)
    return next();

  // If the user is not logged in, send them to the login page
  res.redirect('/login');

}

app.get('/login', function(req, res) {

  // Render the login page
  res.render('user/login');

});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/profile', isAuthenticated, function(req, res) {
  res.render('user/profile', {
    user: req.user
  });
});

app.post('/profile', isAuthenticated, function(req, res) {

  var user = req.user;

  // Update properties if provided
  if (req.body.name)
    user.name = req.body.name;

  if (req.body.username)
    user.username = req.body.username;

  if (req.body.email)
    user.email = req.body.email;

  // Check if we need to update the password
  if (req.body.password && req.body.password_confirm && req.body.password === req.body.password_confirm)
    user.password = req.body.password;

  // Now save the user
  user.save(function(err, callback) {

    if (err)
      req.flash('error', err);
    else
      req.flash('success', 'User profiled updated successfully!');

    res.redirect('/profile');

  });

});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
  }),
  function(req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/profile');
  }
);


app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/profile');
  }
);

/*
|--------------------------------------------------------------------------
| Start the server!
|--------------------------------------------------------------------------
*/

app.listen(process.env.PORT || 3000);