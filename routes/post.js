const express = require('express');
const { render } = require('../app');
const router  = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const upload = require('../config/cloudinary.config');

router.get('/edit/:id',isLoggedIn,(req,res)=> {
const style = "/stylesheets/style.css"
Post.findById(req.params.id)
.then ((post)=> res.render('post/edit-post',{post:post,style}))
.catch((err)=>console.log(err))
})

router.post('/edit/:id',isLoggedIn, (req, res) => {
  const { id } = req.params;
  const {city,budget,currency,days,when,title,description, body } = req.body;
  Post.findByIdAndUpdate(id, { 
    city,
    budget,
    currency,
    days,
    when,
    title,
    description,
    body}, { new: true })
    .then(() => {
      res.redirect('/user/profile')})
    .catch((err) =>{console.log(err,"there was and error updating your post"), 
  res.render('user/profile')});
});





//------------------- Delete Post-----------------------//

router.post('/deletePost/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/user/profile'); 
    })
    .catch(err => console.error('Error deleting the post', err));
});

module.exports = router;