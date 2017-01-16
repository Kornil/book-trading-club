var passport = require('passport');
var Account = require('../models/account');
var Book = require('../models/book');
var https = require('https');

module.exports = function (app) {

  app.use(require('body-parser').urlencoded({ extended: true }));

  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      Book.find({ 'username': req.user.username }, function(err, books){
      if (err) throw err;      
        res.render('profile', { user: req.user, books: books});
    })
  });

  app.post('/profile', function (req, res) {

    var newBook = Book({
      title: data.items[0].volumeInfo.title,
      author: data.items[0].volumeInfo.authors,
      imageLink: data.items[0].volumeInfo.imageLinks.thumbnail,
      user: req.user.username
    });            
    newBook.save(function(err) {
      if (err) throw err;
      res.redirect('/profile');
    });

  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
    });
    passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login'} );
    res.redirect('/profile');
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login'}) );

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });

}