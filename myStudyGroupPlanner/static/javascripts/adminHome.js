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
	vm.selectedBuilding = null;
	vm.selectedBuildingID = null;
	vm.selectedRoom = null;
	vm.buildingStatus = null;
	vm.roomStatus = null;
	vm.buildings = [];
	vm.rooms = [];

	vm.tab = 1;

	vm.reports = [];


	vm.selectTab = function(setTab){
	    vm.tab = setTab;
	}

	vm.isSelected = function(checkTab){
	    return vm.tab === checkTab;
	}

	vm.updateBuilding = function() {

	vm.rooms = null;

		if(vm.selectedBuilding != "addBuilding"){
			document.getElementById("newBuilding").style.visibility = "hidden";
			document.getElementById("makeBuilding").style.visibility = "hidden";
		 for(var i = 0; i < vm.buildings.length; i++){
		 	
			if(vm.buildings[i].name == vm.selectedBuilding){
				vm.selectedBuildingID =vm.buildings[i].id;
		 	}
		 }

		$http({method: 'GET',
		       url: '/api/building/room/'
		      }).then(function(response){
			  vm.rooms = response.data;
		      },
			  function(response){
			   });
		}else if (vm.selectedBuilding == "addBuilding"){
			document.getElementById("newBuilding").style.visibility = "visible";
			document.getElementById("makeBuilding").style.visibility = "visible";
		}


	}

	vm.updateRoom = function(){
		if (vm.selectedRoom == "addRoom"){
			document.getElementById("newRoom").style.visibility = "visible";
			document.getElementById("makeRoom").style.visibility = "visible";

		}else{
			document.getElementById("newRoom").style.visibility = "hidden";
			document.getElementById("makeRoom").style.visibility = "hidden";

		}
	}
	
	vm.makeBuilding = function(){
		vm.buildingAbrv = vm.newBuilding.substring(0,3);
		$http({method: 'POST',
		url: '/api/building/',
		data: {
			name: vm.newBuilding,
			abrv: vm.buildingAbrv
			}
		})
		.then(function(response){
			alert("building Created");
			location.reload();
			// vm.buildingStatus = "BuildingCreated";
		},
		function(response){
			// vm.buildingStatus = "Failed to create building.";
			alert("Failed to create building");
		});
	}


	vm.makeRoom = function(){

		$http({method: 'POST',
		url: '/api/building/room/',
		data: {
			room_num: vm.newRoom,
			building: vm.selectedBuildingID
						}
		})
		.then(function(response){
			alert("Room Created");
			location.reload();
			// vm.roomStatus = "Room Created";
		},
		function(response){
			alert("Failed to create Room");
			// vm.roomStatus = "Failed to create Room.";
		});
	}

	$http({method: 'GET',
	       url: '/api/building/'
	      }).then(function(response){
		  vm.buildings = response.data;
	      },
		  function(response){
		   });

	vm.openReportDetail = function(reportID,reporter,reportee,comment){
		$("#reportViewModal").modal("show");
		vm.currentID = reportID;
		vm.currentReporter = reporter;
		vm.currentReportee = reportee;
		vm.currentComment = comment;
		// $("#txtreporter").val($(this).closest('tr').children()[0].textContent);
    // $("#txtreportee").val($(this).closest('tr').children()[1].textContent);
		// $("#txtmessage").val($(this).closest('tr').children()[2].textContent);


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
