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

var tagSchema = new Schema({
  name: String,
  slug: String,
  created_at: Date,
  updated_at: Date
});

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

var Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;