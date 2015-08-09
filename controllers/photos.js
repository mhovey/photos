var express    = require('express');
var _          = require('underscore');
var Photo      = require('../models/photo');
var router     = express.Router();

/*
|--------------------------------------------------------------------------
| Get All Photos
|--------------------------------------------------------------------------
*/

router.get('/', function(req, res) {

  // Merge passed arguments with defaults
  var query = _.defaults(req.query, {
    limit: 10,
    sortBy: 'created_at'
  });

  // Get the keys in the model a user can query on
  var keys = _.keys(Photo.schema.paths);

  // Separate the schema query from the others supported by Mongoose
  // var schemaQuery = _.

  // Perform the query
  Photo
    .find(query, function(err, photos) {

      if(err) throw err;

      res.json(photos);

    });

});

/*
|--------------------------------------------------------------------------
| Create a Photo
|--------------------------------------------------------------------------
*/

router.post('/', function(req, res) {

  // Create a new instance of our Photo model defined with Mongoose
  var newPhoto = Photo({
    title: 'Michaels First Photo',
    caption: 'Nunc blandit pretium tellus quis congue. Vivamus posuere massa in enim venenatis porttitor. Proin ac magna et quam porta consectetur.',
  });

  // Perform the actual save
  newPhoto.save(function(err) {

    if(err) res.send(err);

    res.json({ message: 'Photo Created!' });

  });

});

/*
|--------------------------------------------------------------------------
| Get a Single Photo
|--------------------------------------------------------------------------
*/

router.get('/:photo_id', function(req, res) {

  Photo.findById(req.params.photo_id, function(err, photo) {

      if(err) res.send(err);

      res.json(photo);

  });

});

/*
|--------------------------------------------------------------------------
| Export Routes
|--------------------------------------------------------------------------
*/

module.exports = router;