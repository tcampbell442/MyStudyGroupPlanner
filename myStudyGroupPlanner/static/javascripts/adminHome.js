(function(){
  'use strict';

  angular
    .module('thinkster')
    .controller('AdminHomeController', AdminHomeController);

  AdminHomeController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace AdminHomeController
  */
  function AdminHomeController($location, $scope, Authentication) {
    var vm = this;

    vm.tab = 1;

    vm.selectTab = function(setTab){
      vm.tab = setTab;
    }

    vm.isSelected = function(checkTab){
      return vm.tab === checkTab;
    }
  }
})();
