/**
* GroupMemberController controller
* @namespace myStudyGroupPlanner.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner')
    .controller('GroupMemberController', GroupMemberController);

  GroupMemberController.$inject = ['$location', '$scope', 'Authentication', '$http', '$routeParams'];

  /**
  * @namespace
  */
  function GroupMemberController($location, $scope, Authentication, $http, $routeParams) {
    var vm = this;

	vm.date = new Date();
    vm.msgpUserAll = {};
    
    vm.groupId = $routeParams.groupId;
    
    vm.getGroupsData = function() {
    	
    	$http({method: 'GET',
			url: '/api/msgpUser/'})
			.then(function(response){
				vm.msgpUserAll = response.data;
			},
			function(response){
				/**vm.status = "failed";*/
		});
    	
    }
    
    vm.getGroupsData();
    
  }

})();
