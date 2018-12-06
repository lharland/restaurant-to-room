(function(){
  'use strict';
  angular
    .module('app')
    .controller('RestaurantsController', RestaurantsController);
        
    RestaurantsController.$inject = ['api'];
       
    function RestaurantsController(api) {
      var vm = this;
      api.getRestaurants()
        .then(function(data) {
          vm.restaurants = data;    
        },
        function(reason) {
          console.log(reason);
        });
    }
}());