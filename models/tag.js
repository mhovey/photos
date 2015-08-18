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

var tagSchema = new Schema({
  name: { type:String, required: true },
  slug: { type:String, required: true },
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

/*
|--------------------------------------------------------------------------
| Middleware for the Tag Model
|--------------------------------------------------------------------------
*/

// Alter Tag entries as they are saved
tagSchema.pre('save', function(next) {

  var tag = this;

  // Slugify the name
  tag.slug = slugify(tag.name);

  next();

});

/*
|--------------------------------------------------------------------------
| Assign the schema and export
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model('Tag', tagSchema);