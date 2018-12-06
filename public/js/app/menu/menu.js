(function() {
  'use strict';
  angular
    .module('app')
    .controller('MenuController', MenuController);
        
  MenuController.$inject = ['api','$routeParams','ngDialog','$scope','$location','cart'];
    
  function MenuController(api, $routeParams, ngDialog, $scope, $location, cart) {
    var vm = this;
        
    vm.items = [];
        
    api.getRestaurantDetails($routeParams.restId)
      .then(function(data) {
        vm.restaurant = data;
      });
            
    vm.viewItem = function(item) {
      vm.activeItem = item;
      vm.activeItem.options = [];
            
      ngDialog.open({
        template: 'item.html',
        className: 'ngdialog-theme-default',
        scope: $scope
      });
    };
        
    vm.toggleOption = function(option) {
      var index = vm.activeItem.options.indexOf(option);
      if (index > -1) {
        vm.activeItem.options.splice(index, 1);
        return;
      }
      vm.activeItem.options.push(option);
    };
        
    vm.addItem = function(item) {
      var newItem = {
        id: item.id,
        name: item.name,
        price: item.price
      };
      if (item.options.length > 0) {
        newItem.options = item.options.map(function(item) {
          return {id: item.id, name: item.name, price: item.price};
        });
      }
      vm.items.push(newItem);
      ngDialog.close();
      console.log(vm.items);
    };
        
    vm.cancel = function() {
      ngDialog.close();
    };
        
    vm.checkout = function() {
      var food = {
        restId: $routeParams.restId,
        restName: vm.restaurant.name,
        items: vm.items
      };
      api.createOrder(food)
        .then(function(data) {
          if (data.success) {
            cart.items = vm.items;    
            return $location.url('/payment'); 
          }
          alert('Something went wrong...');
	    });            
    };
  }
}());