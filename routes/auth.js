const router = require('express').Router();

// ? Package to will handle encryption of password
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Requiring the User model in order to interact with the database
const User = require('../models/User.model');

// Requiring necessary middlewares in order to control access to specific routes
const shouldNotBeLoggedIn = require('../middlewares/shouldNotBeLoggedIn');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/signup', shouldNotBeLoggedIn, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', shouldNotBeLoggedIn, (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
  if (password.length < 8) {
    return res.status(400).render('auth/signup', {
      errorMessage: 'Your password needs to be at least 8 characters'
    });
  }
  User.findOne({ $or: [{ username }, { email }]}).then(found => {
    if (found) {
      return res.status(400).render('auth/signup', { errorMessage: 'Username or email already taken' });
    }
    return bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          email,
          password: hashedPassword
        });
      })
      .then(user => {
        req.session.user = user;
        res.redirect('/user/profile');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).render('auth/signup', { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render('auth/signup', {
            errorMessage: ' the Username or Email is already taken'
          });
        }
        return res.status(500).render('auth/signup', { errorMessage: error.message });
      });
  });
});

router.get('/login', shouldNotBeLoggedIn, (req, res) => {
  res.render('auth/login');
});

router.post('/login',shouldNotBeLoggedIn, (req, res, next) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
          req.session.user = user;
          res.redirect('/user/profile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).render('auth/logout', { errorMessage: err.message });
    }
    res.redirect('/');
  });
});




module.exports = router;
