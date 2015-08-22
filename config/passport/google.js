/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

require('dotenv').load();
var mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = mongoose.model('User');

/*
|--------------------------------------------------------------------------
| Create and export the strategy
|--------------------------------------------------------------------------
*/

module.exports = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  function(accessToken, refreshToken, profile, done) {

    var email = profile.emails[0].value;

    // Find the user by email
    User.findOne({
      email: email
    }, function(err, user) {

      if (err)
        return done(err);

      // if no user is found, we will create one first
      // before attaching the info
      if (!user) {

        user = new User({
          name: profile.displayName,
          username: email,
          email: email,
          password: 'RANDOMPASSWORDHERE'
        });

      }

      // Now attach Google object
      user.google = {
        id: profile.id,
        displayName: profile.displayName,
        email: email,
        photo: profile.photos[0].value,
        accessToken: accessToken,
        refreshToken: refreshToken
      };

      // Save the user and return
      user.save(function(err) {
        done(null, user);
      });

    });

  }
);