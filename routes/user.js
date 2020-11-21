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


router.post("/newpost",isLoggedIn, (req, res) => {
  const { country,city,budget,currency,days,when,description, body } = req.body;
  Post.create({
    type: "text",
    country,
    city,
    budget,
    currency,
    days,
    when,
    description,
    body,
    author: req.session.user._id,
  }).then((createdPost) => {
    // after you create a post, the property author was added to it, but the user is not aware of that, so we must edit the user and the post to the user's posts array
    console.log("createdPost:", createdPost);
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { posts: createdPost._id },
      },
      { new: true }
    ).then((newAndUpdatedUser) => {
      console.log("newAndUpdatedUser:", newAndUpdatedUser);
      res.redirect("/user/profile");
    });
  });
});


router.get('/readmore',isLoggedIn,(req,res)=> { 
  res.render('user/read-more',{ currentUser: req.session.user })})
module.exports = router;