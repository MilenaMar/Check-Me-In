const express = require('express');
const router  = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Post = require('../models/Post.model');

/* GET home page */
router.get('/',(req, res, next) => {
  const style = "/stylesheets/index.css"
  const scrypt = "/javascripts/date-time.js"
  Post.find()
  .sort({createdAt:'desc'})
  .populate('author')
  .then((post)=>res.render('index',{ currentUser: req.session.user, posts:post, style ,scrypt }))
  .catch(err => console.log(err))
});


router.get('/posts', (req, res) => {
const style = "/stylesheets/readP.css"
 Post.find().sort({createdAt:'desc'})
 .populate('author')
 .then(allPost =>  res.render('posts',{post:allPost, style,currentUser: req.session.user}))
 .catch(err => console.log(err))})


module.exports = router;
