const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/posts', (req, res) => {
  res.render('posts');
});

module.exports = router;
