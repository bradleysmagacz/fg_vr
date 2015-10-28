var mongoose = require('mongoose');
var Video = mongoose.model('Video');
var loggedIn = require('../middleware/loggedIn');
var cleanString = require('../helpers/cleanString');

module.exports = function (app) {
  // create
  app.get("/video/create", loggedIn, function (req, res) {
    res.render('video/create.jade');
  })

  app.post("/video/create", loggedIn, function (req, res, next) {
    var title = req.body.title;
    var desc = req.body.description;
    var imgPath = cleanString(req.body.imgPath);
    var categoryField = cleanString(req.body.categories);
    categoryField = categoryField.replace(/\s+/g, '').toLowerCase();

    var dup_key = true;

    var permalink = req.body.title;
    permalink = permalink.replace(/\s+/g, '-').toLowerCase();

    Video.findById(permalink, function(err, video) {
      if (err) return next(err);

      if (video) {
        return res.render('video/create.jade', {
          exists: true
        });
      }

      else { dup_key = false; }

      var categories = new Array();
      categories = categoryField.split(",");

      if (!(dup_key)) { 
        Video.create({
            _id: permalink
          , title: title
          , description: desc
          , categories: categories
          , thumb: imgPath
         }, function (err, video) {
           if (err) return next(err);
           res.redirect('/video/' + video.id);
        });
      }
    })
  });


  // read
  app.get("/video/:id", function (req, res, next) {
    var id = req.params.id;

    var query = Video.findById(id);
    query.exec(function (err, video) {
      if (err) return next(err);

      if (!video) return next(); // 404

      res.render('video/view.jade', { video: video });
    })
  })


  // update
  app.get("/video/edit/:id", loggedIn, function (req, res, next) {
    res.render('video/edit.jade', {
      video: Video.findById(req.params.id)
    });
  });

  app.post("/video/edit/:id", loggedIn, function (req, res, next) {
    Video.edit(req, function (err) {
      if (err) return next(err);
      res.redirect("/video/" + req.params.id);
    });
  });

  // delete
  app.get("/video/remove/:id", loggedIn, function (req, res, next) {
    var id = req.params.id;

    Video.findOne({ _id: id }, function (err, video) {
      if (err) return next(err);

      // validate logged in user authored this video
      if (!(req.session.isAdmin)) {
        return res.send(403);
      }

      video.remove(function (err) {
        if (err) return next(err);

        // TODO display a confirmation msg to user
        res.redirect('/admin');
      });
    });
  });
}
