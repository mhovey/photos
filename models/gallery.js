/*
|--------------------------------------------------------------------------
| Imports
|--------------------------------------------------------------------------
*/

var mongoose = require('mongoose');
var slugify = require('underscore.string/slugify');
var Schema = mongoose.Schema;

/*
|--------------------------------------------------------------------------
| Define the actual schema
|--------------------------------------------------------------------------
*/

var gallerySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
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
| Middleware for the Gallery Model
|--------------------------------------------------------------------------
*/

// Alter Gallery entries as they are saved
gallerySchema.pre('save', function(next) {

  var gallery = this;

  // Slugify the name
  gallery.slug = slugify(gallery.name);

  next();

});

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model('Gallery', gallerySchema);