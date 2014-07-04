/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var hbs = require('hbs');

require('newrelic');

// the ExpressJS App
var app = express();

// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.

// server port number
app.set('port', process.env.PORT || 8000);

//  templates directory to 'views'
app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('prerender-node').set('prerenderToken', 'Uk7w0FJcc2UtLSogaIuF'));

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.configure('production', function() {
  app.use(function(err, req, res, next) {
    console.error(err);
    res.send(500, 'Sorry, there\'s been an error!');
  });
});

app.use(function(req, res) {
  res.render('index.html');
});

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});