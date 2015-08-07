// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
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
  created_at: Date,
  updated_at: Date,
});

// the schema is useless so far
// we need to create a model using it
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our users in our Node applications
module.exports = Photo;