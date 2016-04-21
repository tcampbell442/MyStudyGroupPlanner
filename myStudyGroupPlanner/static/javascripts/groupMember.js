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
    vm.reportFields = {
      reporteeName : "",
      reporteeName : "",
      reportComments : "",
      date : ""
    }

    vm.chatFields = {
      message: ""
    }

    vm.messages = [];
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

    vm.reportUser = function()
    {
  		var user = Authentication.getAuthenticatedAccount();

  		$http({method: 'POST',
  		url: '/api/report/',
  		data: {
  			reporter: vm.reportFields.reporterName,
  			reportee: vm.reportFields.reporteeName,
  			comments: vm.reportFields.reportComments,
        date_submitted: vm.reportFields.date,
  			}
  		})
  		.then(function(response){
  			vm.status = "Report submitted";
  		},
  		function(response){
  			vm.status = "Failed to submit report.";
  		});
  	}

    $http({method: 'GET',
       url: '/api/chat/'})
       .then(function(response){
         vm.messages = response.data;
       },
       function(response){
     });

    vm.sendMessage = function()
    {
      var user = Authentication.getAuthenticatedAccount();

      $http({method: 'POST',
      url: '/api/chat/',
      data: {
        message: vm.chatFields.message,
        }
      })
      .then(function(response){
        vm.status = "Report submitted";
      },
      function(response){
        vm.status = "Failed to submit report.";
      });
    }

  }

})();
