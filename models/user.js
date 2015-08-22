/*
|--------------------------------------------------------------------------
| Imports
|--------------------------------------------------------------------------
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

/*
|--------------------------------------------------------------------------
| Define the actual schema
|--------------------------------------------------------------------------
*/

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  meta: Object,
  google: {
    id: String,
    displayName: String,
    email: String,
    photo: String,
    accessToken: String,
    refreshToken: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

/*
|--------------------------------------------------------------------------
| Middleware for the User Model
|--------------------------------------------------------------------------
*/

// Alter User entries as they are saved
userSchema.pre('save', function(next) {

  var user = this;

  // Only hash the password if it has been modified (or is new)
  // if(!user.isModified('password')) return next();

  // Generate a salt
  bcrypt.genSalt(10, function(err, salt) {

    if (err) return next(err);

    // Hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {

      if (err) return next(err);

      // Override the cleartext password with the hashed one
      user.password = hash;
      next();

    });

  });

});

/*
|--------------------------------------------------------------------------
| Define custom methods for the User Schema
|--------------------------------------------------------------------------
*/

// Define a method for comparing the provided password with the salted version
userSchema.methods.validatePassword = function(candidatePassword, callback) {

  return bcrypt.compareSync(candidatePassword, this.password);

};

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model('User', userSchema);