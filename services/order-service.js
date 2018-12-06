var ordrx = require('ordrin-api');
var config = require('../config');
var Order = require('../models/order').Order;

var api = new ordrx.APIs(config.ordrxKey, ordrx.TEST);

exports.getRestaurants = function(next) {
  var hotel = config.address;
  var args = {
    datetime: 'ASAP',
    addr: hotel.addr,
    city: hotel.city,
    zip: hotel.zip
  }
  api.delivery_list(args, function(err, restaurants) {
    if (err) {
      console.log(err);
      return next(err);
    }
    restaurants = restaurants.filter(function(rest) {
      return rest.is_delivering; 
    });
    next(null, restaurants);
  });
};

exports.getRestaurantDetails = function(restId, next) {
  api.restaurant_details({rid: restId}, function(err, details) {
    if (err) {
      console.log(err);
    }  
    next(err, details);
  });
};

exports.createOrder = function(user, food, next) {
  var order = new Order({
    user: user,
    food: food
  });
  order.save(function(err, savedOrder) {
    if (!err) {
      return next(null, savedOrder._id);
    }
    next(err);
  });
};

exports.prepareTray = function(items) {
  var tray = [];
  for (var i = 0; i < items.length; i++) {
    var trayItem = items[i].id + '/1';
    if (items[i].options) {
      for (var j = 0; j < items[i].options.length; j++) {
        trayItem += ',' + items[i].options[j].id;
      }
    }
    tray.push(trayItem);
  }
  return tray.join('+');
};

exports.placeOrder = function(order_id, card, next) {
  var self = this;
  Order.findOne({_id: order_id}, function(err, order) {
    if (err) {
      console.log(err);
      return next(err);
    }
    var args = {
      rid: order.food.restId,
      em: order.user.email,
      tray: self.prepareTray(order.food.items),
      tip: '0.00',
      first_name: order.user.firstName,
      last_name: order.user.lastName,
      phone: config.phone,
      zip: config.address.zip,
      addr: config.address.addr,
      addr2: order.user.roomNumber.toString(),
      city: config.address.city,
      state: config.address.state,
      card_name: order.user.firstName + order.user.lastName,
      card_number: card.number,
      card_cvc: card.code,
      card_expiry: card.expirationMonth + '/' + card.expirationYear,
      card_bill_addr: config.address.addr,
      card_bill_city: config.address.city,
      card_bill_state: config.address.state,
      card_bill_phone: config.phone,
      card_bill_zip: card.zip,
      delivery_date: 'ASAP'
    };
    
    api.order_guest(args, function(err, result) {
      if (!err) {
        console.log(result);
        order.refnum = result.refnum;
        return order.save(function(err) {
          next(null, {success:true});
        });  
      }
      console.log(err);
      next(err, {success:false});
    })
  });  
};