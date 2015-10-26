
var mongoose = require('mongoose');

module.exports = function (app) {
  
  app.get("/test", function (req, res) {
    res.render('test.jade');
  });
}