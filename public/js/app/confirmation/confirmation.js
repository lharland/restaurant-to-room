(function() {
  'use strict';
  angular
    .module('app')
    .controller('ConfirmationController', ConfirmationController);
        
  ConfirmationController.$inject = ['cart']
    
  function ConfirmationController(cart) {
    var vm = this;
    vm.items = cart.items;
  }   
}());