const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/User.model');

// Requiring necessary middlewares in order to control access to specific routes
const shouldNotBeLoggedIn = require('../middlewares/shouldNotBeLoggedIn');
const isLoggedIn = require('../middlewares/isLoggedIn');

///// Sign UP get and post Routes///////////////////////////

router.get('/signup', shouldNotBeLoggedIn, (req, res) => {
  const style = "/stylesheets/forms.css"
  res.render('auth/signup',{style});
});


//-------------------  post() method  -------------------//
router.post('/signup', shouldNotBeLoggedIn, (req, res) => {
  const { username, email, password } = req.body;
  const style = "/stylesheets/forms.css"
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.',style });
    return;
  }
  if (password.length < 8) {
    return res.status(400).render('auth/signup', {
      errorMessage: 'Your password needs to be at least 8 characters',style
    });
  }
  User.findOne({ $or: [{ username }, { email }]}).then(found => {
    const style = "/stylesheets/forms.css"
    if (found) {
      return res.status(400)
      .render('auth/signup', { errorMessage: 'Username or email already taken',style });
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
        const style = "/stylesheets/forms.css"
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).render('auth/signup', { errorMessage: error.message,style });
        }
        if (error.code === 11000) {
          return res.status(400).render('auth/signup', {
            errorMessage: ' the Username or Email is already taken',style
          });
        }
        return  res.status(500).render('auth/signup', { errorMessage: error.message,style });
      });
  });
});



/////////////// Log in  get and post Routes///////////////////////////


router.get('/login', shouldNotBeLoggedIn, (req, res) => {
  const style = "/stylesheets/forms.css"
  res.render('auth/login', {style});
});

//---------------- post () method -------------------------//
router.post('/login',shouldNotBeLoggedIn, (req, res, next) => {
  const { email, password } = req.body;
  const style = "/stylesheets/forms.css"
  if (email === '' || password === '') { 
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.',style
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      const style = "/stylesheets/forms.css"
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.',style });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
          req.session.user = user;
          res.redirect('/user/profile');
      } else {
        const style = "/stylesheets/forms.css"
        res.render('auth/login', { errorMessage: 'Incorrect password.',style });
      }
    })
    .catch(error => next(error));
});


/////////////// Log out Post Route///////////////////////////

router.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).render('auth/logout', { errorMessage: err.message });
    }
    res.redirect('/');
  });
});




module.exports = router;
