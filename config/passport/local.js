/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

var mongoose      = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User          = mongoose.model('User');

/*
|--------------------------------------------------------------------------
| Create and export the strategy
|--------------------------------------------------------------------------
*/

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'email':  email }, function(err, user) {

        // if there are any errors, return the error before anything else
        if(err)
            return done(err);

        // if no user is found, return the message
        if(!user)
            return done(null, false, req.flash('error', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

        // Now, validate the password
        if(!user.validatePassword(password))
          return done(null, false, req.flash('error', 'Oops! Wrong password.'));

        // Successful Log in!
        return done(null, user);

    });

  }
);