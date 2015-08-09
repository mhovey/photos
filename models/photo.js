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

var photoSchema = new Schema({
  title: String,
  slug: String,
  status: String,
  description: String,
  author: {
    name: String,
    email: String,
    username: String
  },
  meta: {
    year: Number,
    location: String,
    caption: String
  },
  gallery: [{ name: String, slug: String }],
  tags: [{ name: String, slug: String }],
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
});

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

var Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;