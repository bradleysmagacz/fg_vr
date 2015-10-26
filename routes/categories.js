var mongoose = require('mongoose');
var Video = mongoose.model('Video');

module.exports = function (app) { 

	app.get("/category/:category", function (req, res, next) {
		var category = req.params.category;

		Video.find({ categories : category }).sort({created:-1}).limit().exec(function (err, videos) {
        if (err) return next(err);

        res.render('gallery.jade', { videos: videos });
    	});
	});
}