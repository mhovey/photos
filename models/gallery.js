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

var gallerySchema = new Schema({
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

var Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;