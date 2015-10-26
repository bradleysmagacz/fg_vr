var mongoose = require('mongoose');
var Video = mongoose.model('Video');

module.exports = function(app) {

	app.get('/gallery', function (req, res, next) {
    Video.find().sort({created:-1}).limit(10).exec(function (err, videos) {
    	if (err) return next(err);
      res.render('gallery.jade', { videos: videos });
  	});
  });
}