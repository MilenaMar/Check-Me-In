const express = require('express');
const router  = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Post = require('../models/Post.model');
const User = require('../models/User.model');

/* GET home page */
router.get('/',(req, res, next) => {
  res.render('index',{ currentUser: req.session.user });
});


router.get('/posts', (req, res) => {
 Post.find().sort({createdAt:'desc'})
 .populate('author')
 .then(allPost =>  res.render('posts',{post:allPost}))
 .catch(err => console.log(err))})


// router.put('/like',isLoggedIn,(req,res)=>{
//  Post.findByIdAndUpdate(req.body.postid,{
//    $push:{likes:req.user._id}
//  },
//  {new:true})
//  .exec((err,result) =>{
//    if(err){
//      return res.status(422).json({error:err})
//    } else 
//    {
//      res.json(result)
//    }
//  })
// })
//
//
// router.put('/unlike',isLoggedIn,(req,res)=>{
//  Post.findByIdAndUpdate(req.body.postid,{
//    $pull:{likes:req.user._id}
//  },
//  {new:true})
//  .exec((err,result) =>{
//    if(err){
//      return res.status(500).render('auth/signup', { errorMessage: err });
//    } else 
//    {
//      res.render(result)
//    }
//  })
// })

module.exports = router;
