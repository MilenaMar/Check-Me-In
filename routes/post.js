const express = require('express');
const { render } = require('../app');
const router  = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const upload = require('../config/cloudinary.config');

router.get('/edit/:id',isLoggedIn,(req,res)=> {
Post.findById(req.params.id)
.then ((post)=> res.render('post/edit-post',post))
.catch((err)=>console.log(err))
})

router.post('/edit/:id',isLoggedIn,upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { country,city,budget,currency,days,when,title,description, body } = req.body;
  const image = req.file.path
  Post.findByIdAndUpdate(id, { country,city,budget,currency,days,when,title,image, description, body }, { new: true })
    .then(() => {
      res.redirect('/user/profile')})
    .catch(() =>res.redirect('/user/profile',{errorMessage:"there was and error updating your post"}));
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