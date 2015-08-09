/*
|--------------------------------------------------------------------------
| Imports
|--------------------------------------------------------------------------
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
|--------------------------------------------------------------------------
| Define the actual schema
|--------------------------------------------------------------------------
*/

var userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  meta: Object,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

var User = mongoose.model('User', userSchema);

module.exports = User;