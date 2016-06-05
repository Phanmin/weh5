var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://127.0.0.1:27017/weh5");

var routes = require('./routes/index');
var users = require('./routes/users');
var edit=require('./routes/edit');
var show=require('./routes/show');
var myh5=require('./routes/myh5');
var store=require('./routes/store')
var admin=require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'viola_chen_fighting',
  cookie:{
    maxAge:24*60*60*1000,
    secure:false
  },
  resave:false,
  saveUninitialized:false
}));
app.use('/', routes);
app.use('/users', users);
app.use('/edit',edit);
app.use('/show',show);
app.use('/myh5',myh5);
app.use('/admin',admin);
app.use('/store',store);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.use(function(req,res,next){
  var err=req.session.error;
  var msg=req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message='';
  if(err) res.locals.message='<p class="msg error">' + err + '</p>';;
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
})

module.exports = app;
