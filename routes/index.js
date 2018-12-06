var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var vm = {
    error: req.flash('error'),
      title: 'Restaurant to Room',
  };
  res.render('index', vm);
});

module.exports = router;

//something here
