var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict');
var orderService = require('../services/order-service');

router.get('/', restrict, function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  var vm = { 
    title: 'Place an Order',
    firstName: req.user ? req.user.firstName : null,
    orderId: req.session.orderId
  };
  res.render('orders/index', vm);
});

router.get('/api/restaurants', restrict, function(req, res, next) {
  orderService.getRestaurants(function(err, restaurants) {
    if (err) {
      return res.status(500).json({error:'Failed to retrieve restaurants'});
    }        
    res.json(restaurants);
  });
});

router.get('/api/restaurant-details/:restId', restrict, function(req, res, next) {
  orderService.getRestaurantDetails(req.params.restId, function(err, details) {
    if (err) {
      return res.status(500).json({error:'Failed to retrieve details'});
    }
    res.json(details);
  });
});

router.post('/api/create-order', restrict, function(req, res, next) {
  orderService.createOrder(req.user._doc, req.body, function(err, orderId) {
    if (err) {
      return res.status(500).json({error: 'Failed to create order.'});
    }
    req.session.order_id = orderId;
    res.json({success:true});
  });
});

router.post('/api/place-order', restrict, function(req, res, next) {
  orderService.placeOrder(req.session.order_id, req.body, function(err, result) {
    if (err) {
      return res.status(500).json({error:'Failed to place order'});
    }        
    res.json(result);
  });  
});

module.exports = router;