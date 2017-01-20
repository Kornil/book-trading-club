var passport = require('passport');
var Account = require('../models/account');
var Book = require('../models/book');

module.exports = function (app) {

  app.use(require('body-parser').urlencoded({ extended: true }));

  app.get('/', function (req, res) {
      if(!req.user){
        user = "";
      }else{
        user = !req.user.username;        
      }
      Book.find({ 'user': user }, function(err, books){
      if (err) throw err;      
        res.render('index', { user: req.user, books: books});
      })
  });

  app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
      Book.find({ 'user': req.user.username }, function(err, books){
      if (err) throw err;      
        res.render('profile', { user: req.user, books: books});
      })
  });

  app.delete('/profile/:id', function(req, res){
        Book.findByIdAndRemove(req.params.id, function(err){
            if (err) throw err;
            res.redirect('/profile');
        });
    });

  app.post('/profile', function (req, res) {
    var data = req.body.data;
    var image = (data.volumeInfo.imageLinks != undefined)?
    "https"+data.volumeInfo.imageLinks.thumbnail.substring(4) :
    "https://img1.wikia.nocookie.net/__cb20141028171337/pandorahearts/images/a/ad/Not_available.jpg";

    var newBook = Book({
      title: data.volumeInfo.title,
      author: data.volumeInfo.authors,
      imageLink: image,
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

}