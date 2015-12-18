var mongoose = require('mongoose');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var async = require('async');
var flash = require('express-flash');

var transporter = nodemailer.createTransport({
    service: 'Yahoo',
    auth: {
        user: 'bradleysmagacz@yahoo.com',
        pass: 'XXXXXXXX'
    }
});

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = function(app) {
  app.get('/signup', function(req, res) {
    res.render('signup.jade');
  });

  app.post('/signup', function(req, res, next) {
    var firstName = cleanString(req.body.first_name);
    var lastName = cleanString(req.body.last_name);
    var userName = cleanString(req.body.new_username);
    var email = cleanString(req.body.new_email);
    var pass = cleanString(req.body.new_password);
    var c_pass = cleanString(req.body.confirm_password)
    
    if (!(email && pass)) {
      return invalid();
    }

    if (pass!=c_pass) {
      return unmatched();
    }

    User.findById(email, function(err, user) {
      if (err) return next(err);

      if (user) {
        return res.render('signup.jade', {
          exists: true
        });
      }

      crypto.randomBytes(16, function(err, bytes) {
        if (err) return next(err);

        var user = {
          _id: email
        };

        firstName = firstName.capitalize();
        lastName = lastName.capitalize();

        user.name = {
          first: firstName,
          last: lastName
        };
        user.username = userName;
        user.salt = bytes.toString('utf8');
        user.hash = hash(pass, user.salt);

        User.create(user, function(err, newUser) {
          if (err) {
            if (err instanceof mongoose.Error.ValidationError) {
              return invalid();
            }
            return next(err);
          }

          if (!(user.isAdmin)) { req.session.isAdmin = false; }

          // user created successfully
          req.session.isLoggedIn = true;
          req.session.user = email;
          console.log('created user: %s', email);

          var mailOptions = {
            from: 'Foggy Goggles <bradleysmagacz@yahoo.com>', // sender address 
            to: email, // list of receivers 
            subject: 'Welcome to Foggy Goggles!', // Subject line 
            text: 'Hi, ' + firstName, // plaintext body 
            html: '<strong>Hello, ' + firstName + '</strong>' // html body 
          };

          transporter.sendMail(mailOptions, function(err, info){
            if(err) { return console.log(err); }

            console.log('Message sent: ' + info.response);
         
          });

          return res.redirect('/account');
        })
      })
    })

    function invalid() {
      return res.render('signup.jade', {
        invalid: true
      });
    }

    function unmatched() {
      return res.render('signup.jade', {
        unmatched: true
      });
    }

  });
  
  app.get('/login', function(req, res) {
    res.render('login.jade');
  })

  app.post('/login', function (req, res, next) {
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

      // check pass
      if (user.hash != hash(pass, user.salt)) {
        return invalid();
      }

      if (!(user.isAdmin)) { req.session.isAdmin = false; console.log('This person who just logged in is not allowed to access the admin area'); }
      if (user.isAdmin) { req.session.isAdmin = true; }

      req.session.isLoggedIn = true;
      req.session.user = email;
      res.redirect('/admin');
    })

    function invalid() {
      return res.send('login.jade', {
        invalid: true
      });
    }
  })

  app.get('/logout', function(req, res) {
    req.session.isAdmin = false;
    req.session.isLoggedIn = false;
    req.session.user = null;
    res.redirect('/');
  });

  app.get('/forgot', function(req, res) { 
    res.render('forgot.jade', {
      user: req.session.user
    })
  });

  app.post('/forgot', function(req, res, next) {

    var email = cleanString(req.body.email);

    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findById(email, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
    
        var mailOptions = {
          to: email,
          from: 'Foggy Goggles <bradleysmagacz@yahoo.com>',
          subject: 'Foggy Goggles Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(err, info) {
          req.flash('info', 'An e-mail has been sent to ' + email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset.jade', {
        user: req.user
      });
    });
  });

  app.post('/reset/:token', function(req, res) {

    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
          }

          var email = user._id;
          var pass1 = req.body.new_password;
          var pass2 = req.body.confirm_password;
          user.password = req.body.new_password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          if (pass1!=pass2) {
            return invalid();
          }

          else {
            user.save(function(err) {
              req.session.isLoggedIn = true;
              req.session.user = email;
              res.redirect('/account');
            });
          }
        });
      },
      function(user, done) {
        var mailOptions = {
          from: 'Foggy Goggles <bradleysmagacz@yahoo.com>', // sender address 
          to: email, // list of receivers 
          subject: 'Your password has been changed', // Subject line 
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transporter.sendMail(mailOptions, function(err, info) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });

    function invalid() {
      return res.render('reset.jade', {
        invalid: true
      });
    }

  });
}
