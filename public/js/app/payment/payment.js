(function() {
  'use strict';
    
  angular
    .module('app')
    .controller('PaymentController', PaymentController);
        
    PaymentController.$inject = ['api', '$location'];
        
    function PaymentController(api, $location) {
      var vm = this;
      
	  vm.submit = function() {
        vm.showProgress = true;
        api.placeOrder(vm.card)
          .then(function(response) {
            if (response && response.success) {
              return $location.url('/confirmation');
            }
            alert('Something went wrong...');
          },
          function(reason) {
            alert('Something went wrong...' + reason);
          });
      };
    }
}());