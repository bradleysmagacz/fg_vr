
var mongoose = require('mongoose');
var express = require('express');
var cons = require('consolidate');

// add mongoose query and promise support to express
require('express-mongoose');

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

var db_config = process.env.DB_CONFIG;
var local_config = 'mongodb://localhost/fg_vr';

mongoose.set('debug', true);
mongoose.connect((db_config || local_config), function (err) {
  if (err) throw err;
  
  var app = express();

  //app.engine('html', cons.swig);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');

  app.set('port', (process.env.PORT || 4200));

  app.use('/public', express.static(__dirname + '/public'));

  app.use("/bower_components", express.static(__dirname + '/bower_components'));

  middleware(app);
  routes(app);

  app.listen(app.get('port'), function () {
    console.log('Now listening on port ' + app.get('port'));
  })
})
