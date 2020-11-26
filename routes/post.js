const express = require('express');
const router  = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const { post } = require('./user');

router.get('/edit/:id',isLoggedIn,(req,res)=> {
const style = "/stylesheets/posts.css"
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
  Post.findByIdAndDelete(req.params.id).then((deletedPost) => {
    User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { $pull: { posts: deletedPost._id } }
    ).then(() => {
      res.redirect('/user/profile');
    })
    .catch(err => console.error('Error deleting the post', err));
  });
});


//----------------------- Like a Post -----------------------//

//router.post('/like/:id', (req, res, next) => {
//    Post.findOneAndUpdate(
//      { _id: req.params.id},{$inc: {likeCount: +1}, $push:{likes: req.session.user._id}},
//      {new:true}) 
//         .then((post)=>{ console.log(post),(res.redirect(`/user/readmore/${post.slug}`))})
//});
//
//
//router.post('/unlike/:id', (req, res, next) => {
//  Post.findOneAndUpdate(
//    { _id: req.params.id},{$inc: {likeCount: -1}, $pull:{likes: req.session.user._id}},
//    {new:true}) 
//       .then((post)=>{ console.log(post),(res.redirect(`/user/readmore/${post.slug}`))})
//  });


module.exports = router;