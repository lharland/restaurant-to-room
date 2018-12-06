(function() {
  'use strict';
  angular.module('app')
    .factory('cart', cartService);

    function cartService() {
      return {items: []};
    }
}());