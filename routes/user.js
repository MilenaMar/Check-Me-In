const router = require('express').Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const shouldNotBeLoggedIn = require('../middlewares/shouldNotBeLoggedIn'); // user shouldn't be log in
const isLoggedIn = require('../middlewares/isLoggedIn'); // user needs to be log in


router.get('/profile',isLoggedIn,(req,res)=>{
res.render('user/profile',{ currentUser: req.session.user })})

router.get('/settings',isLoggedIn,(req,res)=> { 
res.render('user/settings',{ currentUser: req.session.user })})

router.get('/newpost',isLoggedIn,(req,res)=> { 
res.render('user/new-post',{ currentUser: req.session.user })})

router.get('/readmore',isLoggedIn,(req,res)=> { 
  res.render('user/read-more',{ currentUser: req.session.user })})
module.exports = router;