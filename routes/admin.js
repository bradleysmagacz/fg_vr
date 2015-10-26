
var mongoose = require('mongoose');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function(app) {
	app.get('/admin', function (req, res, next) { 
		res.render('admin.jade');
	});

	app.post('/admin', function (req, res, next) {
    // validate input
    var email = cleanString(req.body.email);
    var pass = cleanString(req.body.password);
    if (!(email && pass)) {
      return invalid();
    }

    // user friendly
    email = email.toLowerCase();

    // query mongodb
    User.findById(email, function(err, user) {
      if (err) return next(err);

      if (!user) {
        return invalid();
      }

      if (!(user.isAdmin)) { 
      	return prohibited(); 
      }

      // check pass
      if (user.hash != hash(pass, user.salt)) {
        return invalid();
      }

      if (user.isAdmin) { req.session.isAdmin = true; }
      req.session.isLoggedIn = true;
      req.session.user = email;
      res.redirect('/admin');
    })

    function invalid() {
      return res.render('admin.jade', {
        invalid: true
      });
    }

    function prohibited() {
      return res.render('admin.jade', {
        prohibited: true
      });
    }
  });
}