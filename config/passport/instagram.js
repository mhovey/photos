/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

require('dotenv').load();
var mongoose = require('mongoose');
var InstagramStrategy = require('passport-instagram').Strategy;
var User = mongoose.model('User');

/*
|--------------------------------------------------------------------------
| Create and export the strategy
|--------------------------------------------------------------------------
*/

module.exports = new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_REDIRECT_URI,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {

    var profileData = profile._json.data
      user = req.user;

    // If the user is not already logged in, we will create a
    // new account before attaching the instagram info
    if( !user ) {

      user = new User({
        name: profileData.full_name,
        username: profileData.username,
        password: 'RANDOMPASSWORDHERE'
      });

    }

    // Now attach Instagram object
    user.instagram = {
      id: profileData.id,
      fullName: profileData.full_name,
      photo: profileData.profile_picture,
      accessToken: accessToken,
      refreshToken: refreshToken
    };

    // Save the user and return
    user.save(function(err) {
      done(null, user);
    });

  }
);