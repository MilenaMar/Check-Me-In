const router = require('express').Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const shouldNotBeLoggedIn = require('../middlewares/shouldNotBeLoggedIn'); // user shouldn't be log in
const isLoggedIn = require('../middlewares/isLoggedIn'); // user needs to be log in
const bcrypt = require('bcryptjs');


////// User Profile//////////////////////
router.get('/profile',isLoggedIn,(req,res)=>{
  User.findById(req.session.user._id)
  .populate("posts")
  .then((myUser) => {
    res.render("user/profile", {currentUser: myUser });
  });
});
/////// User Settings - Update  details, Profile Picture and Password////////////
router.get('/settings',isLoggedIn,(req,res)=> { 
res.render('user/settings',{ currentUser: req.session.user })})

//----------- Update Profile-------------------------------///
router.get('/settings',isLoggedIn,(req,res)=> { 
  res.render('user/settings',{ currentUser: req.session.user })})
  
router.post('/settings', (req, res) => {
  const { username, email, about,location } = req.body;
  User.findByIdAndUpdate(req.session.user._id, { username, email, about,location }, { new: true })
    .then((currentUser) => {
      req.session.user = currentUser;
      res.render('user/settings', { updateMessage:"Settings updated"})})
    .catch(() =>res.redirect('user/settings',{errorMessage:"there was and error updating your profile"}));
});

//-----------------UpdatePassword-------------------------------///

router.post("/updatePassword", (req, res) => {
  const { oldPassword, newPassword, repeatPassword } = req.body;
  if (newPassword !== repeatPassword) {
    res.render('user/settings',{errorMessage:'Your new passowrd and confirmation do not match please try again'})
  }
  const isSamePassword = bcrypt.compareSync(
    oldPassword,
    req.session.user.password
  );

  if (!isSamePassword) {
  res.render('user/settings',{errorMessage:'Please try again  your old password'})
  }
  const hash = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, hash);
  User.findByIdAndUpdate(
    req.session.user._id,
    { password: hashedPassword },
    { new: true }
  ).then((currentUser) => {
    req.session.user = currentUser;
    res.render("user/settings", {
      updateMessageP: "Your Password has being update",
    });
  });
});


///// Routes for the Post Model/////////////////////////////////////
router.get('/newpost',isLoggedIn,(req,res)=> { 
res.render('user/new-post',{ currentUser: req.session.user })})


router.post("/newpost",isLoggedIn, (req, res) => {
  const { country,city,budget,currency,days,when,title,description, body } = req.body;
  Post.create({
    type: "text",
    country,
    city,
    budget,
    currency,
    days,
    when,
    title,
    description,
    body,
    author: req.session.user._id,})
    .then((createdPost) => {
    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $addToSet: { posts: createdPost._id },
      },
      { new: true }
    )
    .then((currentUser) => {
      req.session.user = currentUser;
      res.redirect("/user/profile");
    });
  });
});




router.get('/readmore/:slug',isLoggedIn, (req,res)=>{
  Post.findOne({slug:req.params.slug})
  .then((post) => res.render('user/read-more', post))
  .catch(err => console.log(err))
  });

module.exports = router;