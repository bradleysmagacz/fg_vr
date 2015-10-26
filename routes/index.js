var errors = require('./errors');
var login = require('./login');
var admin = require('./admin');
var videos = require('./videos');
var categories = require('./categories');
var test = require('./test');

//var posts = require('./posts');
var mongoose = require('mongoose');
var Video = mongoose.model('Video');
var gallery = require('./gallery');
//var BlogPost = mongoose.model('BlogPost');

module.exports = function (app) {

  // home page
  app.get('/', function (req, res, next) {
      Video.find().sort({created:-1}).limit(3).exec(function (err, videos) {
        if (err) return next(err);
        res.render('home.jade', { videos: videos });
    });
  });

  // login / logout routes
  login(app);

  admin(app);

  categories(app);

  videos(app);

  // blog post crud
  //posts(app);

  gallery(app);

  test(app);

  // error handlers
  errors(app);
}
