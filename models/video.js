
var mongoose = require('mongoose');
var createdDate = require('../plugins/createdDate');

var schema = mongoose.Schema({
   	_id: { type: String, required: true }
  , title: { type: String, required: true }
  , description: { type: String }
  , categories: { type: Array }
  , actors: { type: Array }
  , age: { type: String }
  , interracial: { type: Boolean, default:0 }
  , orientation: { type: String }
  , thumb: { type: String }
});

// add created date property
schema.plugin(createdDate);

schema.statics.edit = function (req, callback) {
  var id = req.params.id;

  // validate current user authored this blogpost
  var query = { _id: id };

  var update = {};
  update.title = req.body.title;
  update.description = req.body.description;
  update.interracial = req.body.iRacial;
  update.thumb = req.body.imgPath;

  this.update(query, update, function (err, numAffected) {
    if (err) return callback(err);

    if (0 === numAffected) {
      return callback(new Error('no post to modify'));
    }

    callback();
  })
}

// add created date property
schema.plugin(createdDate);

// when new blogposts are created, lets tweet
// npm install mongoose-lifecycle
// http://plugins.mongoosejs.com?q=events
var lifecycle = require('mongoose-lifecycle');
schema.plugin(lifecycle);

// compile the model
var Video = mongoose.model('Video', schema);

// handle events
Video.on('afterInsert', function (post) {
  // fake tweet this
  var url = "http://localhost:4200/video/";
  console.log('New video has been created! %s%s', url, post.id);
})

Video.on('afterRemove', function (post) {
  this.remove({ video: video._id }).exec(function (err) {
    if (err) {
      console.error('Had trouble removing the video', err.stack);
    }
  })
})

module.exports = Video;
