/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

var mongoose = require('mongoose');
var User     = mongoose.model('User');
var local    = require('./passport/local');
var google   = require('./passport/google');
// var facebook = require('./passport/facebook');
// var twitter  = require('./passport/twitter');
// var linkedin = require('./passport/linkedin');
// var github   = require('./passport/github');

/*
|--------------------------------------------------------------------------
| Expose the Passport Strategies
|--------------------------------------------------------------------------
*/

module.exports = function(passport, config) {

  // use these strategies
  passport.use('local-login', local);
  passport.use('google', google);
  // passport.use(facebook);
  // passport.use(twitter);
  // passport.use(linkedin);
  // passport.use(github);

};