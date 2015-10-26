var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');
var flash = require('express-flash');
//var serveStatic = require('serve-static');

module.exports = function (app) {
  app.use(logger('dev'));

  // this is good enough for now but you'll
  // want to use connect-mongo or similar
  // for persistant sessions
  app.use(cookieParser());

  app.use(compression());

  app.use(session({ secret: 'foggy goggles',
                    saveUninitialized: true,
                    resave: true }));

  app.use(flash());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  // expose session to views
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  })
}
