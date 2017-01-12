// dependencies
var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// global config
var app = express();
var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/assets'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.methodOverride());
app.use(app.router);

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// env config
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

mongoose.connect(process.env.MONGO_DATABASE);

// mongo model
// var Model_Name = require('add_your_models_here');

require('./routes')(app);

// run server
app.listen(port);
