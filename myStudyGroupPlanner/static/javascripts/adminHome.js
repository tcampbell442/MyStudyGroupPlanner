(function(){
    'use strict';

    angular
	.module('myStudyGroupPlanner')
	.controller('AdminHomeController', AdminHomeController);

    AdminHomeController.$inject = ['$location', '$scope', 'Authentication', '$http'];

    /**
     * @namespace AdminHomeController
     */
    function AdminHomeController($location, $scope, Authentication, $http) {
	var vm = this;
	vm.selectedStudyLocation = null;
	vm.studyLocations = [];

	vm.tab = 1;

	vm.reports = [];
	// vm.reports = [
	//     {
	// 	code: "111",
	// 	date: "mm/dd/yyyy",
	// 	reporter: "User 1",
	// 	recipient: "User 2",
	// 	message: "This user was not participating in group discussions.",
	//     },
	//
	//     {
	// 	code: "222",
	// 	date: "mm/dd/yyyy",
	// 	reporter: "User 3",
	// 	recipient: "User 4",
	// 	message: "This user was unnecessarily reporting other users.",
	//     },
	//
	//     {
	// 	code: "333",
	// 	date: "mm/dd/yyyy",
	// 	reporter: "User 5",
	// 	recipient: "User 6",
	// 	message: "This user is not attending any meetings.",
	//     },
	//
	//     {
	// 	code: "444",
	// 	date: "mm/dd/yyyy",
	// 	reporter: "User 7",
	// 	recipient: "User 8",
	// 	message: "This user is being disruptive.",
	//     }];

	vm.selectTab = function(setTab){
	    vm.tab = setTab;
	}

	vm.isSelected = function(checkTab){
	    return vm.tab === checkTab;
	}

	/**
	   vm.studyLocation = {
	   building: "",
	   roomNum: "",
	   maxCapacity: ""
	   }
	**/
	/*$http({method: 'GET',
	       url: '/api/building/'
	      }).then(function(response){
		  vm.studyLocations = response.data;
	      },
		      function(response){
		      });*/

	/**
	   vm.addname = function (building){
    	   if ( !_.contains( vm.studyLocations.name , building.name ) ){
      	   vm.studyLocations.push( building.name );
	   vm.studyLocations.name = {};
    	   }
	**/

	$http({method: 'GET',
		url: '/api/report/'
		}).then(function(response){
			vm.reports = response.data;
		},
		function(response){
	});

	
	vm.usernameTemp = "";

	//vm.buildings = ["Sherman", "ITE", "Engineering", "Biology"];

	vm.username = 'username1';

	//activate();
    }

   /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated.
    * @memberOf myStudyGroupPlanner.
    */
    /*function activate() {
	var authenticatedAccount = Authentication.getAuthenticatedAccount();
	var username = authenticatedAccount.username
	//var is_admin = $routeParams.username.is_admin;

	// Redirect if not logged in
	if (!authenticatedAccount) {
	    //console.log('authenticated user is' + authenticatedAccount');
            $location.url('/');
            //Snackbar.error('You are not authorized to view this page.');
	} else {
            // Redirect if logged in, but not the owner of this profile.
            if ((username.toLowerCase()).indexOf("admin") == -1) {
		//console.log('is the user an admin: ' + authenticatedAccount.is_admin);
		$location.url('/');
		//Snackbar.error('You are not authorized to view this page.');
            }
	}
    }*/

})();
