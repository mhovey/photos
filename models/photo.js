/*
|--------------------------------------------------------------------------
| Imports
|--------------------------------------------------------------------------
*/

var mongoose = require('mongoose');
var slugify  = require('underscore.string/slugify');
var Schema   = mongoose.Schema;

/*
|--------------------------------------------------------------------------
| Define the actual schema
|--------------------------------------------------------------------------
*/

var photoSchema = new Schema({
  title: { type:String, required: true },
  slug: { type:String, required: true },
  status: { type:String, required: true },
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
| Middleware for the Photo Model
|--------------------------------------------------------------------------
*/

// Alter Photo entries as they are saved
photoSchema.pre('save', function(next) {

  var photo = this;

  // Slugify the title
  photo.slug = slugify(photo.name);

  next();

});

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model('Photo', photoSchema);