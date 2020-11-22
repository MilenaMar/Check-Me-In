const express = require('express');
const { render } = require('../app');
const router  = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Post = require('../models/Post.model');
const User = require('../models/User.model');

router.get('/edit/:id',isLoggedIn,(req,res)=> {
Post.findById(req.params.id)
.then ((post)=> res.render('post/edit-post',post))
.catch((err)=>console.log(err))
})

router.post('/edit/:id',isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { country,city,budget,currency,days,when,title,description, body } = req.body;
  Post.findByIdAndUpdate(id, { country,city,budget,currency,days,when,title,description, body }, { new: true })
    .then((updatedPost) => {
      res.redirect('/user/profile')})
    .catch(() =>res.redirect('/user/profile',{errorMessage:"there was and error updating your profile"}));
});


router.post('/deletePost/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/user/profile'); 
    })
    .catch(err => console.error('Error deleting the celebrity', err));
});

module.exports = router;