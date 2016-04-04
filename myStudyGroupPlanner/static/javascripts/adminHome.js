(function(){
    'use strict';
    
    angular
	.module('myStudyGroupPlanner')
	.controller('AdminHomeController', AdminHomeController);
    
    AdminHomeController.$inject = ['$location', '$scope', 'Authentication'];
    
    /**
     * @namespace AdminHomeController
     */
    function AdminHomeController($location, $scope, Authentication) {
	var vm = this;
	
	vm.tab = 1;
      
	vm.reports = [
	    {
		code: "111",
		date: "mm/dd/yyyy",
	    },
	    
	    {
		code: "222",
		date: "mm/dd/yyyy",
	    },
	    
	    {
		code: "333",
		date: "mm/dd/yyyy",
	    },
	    
	    {
		code: "444",
		date: "mm/dd/yyyy",
	    }];
	
	vm.selectTab = function(setTab){
	    vm.tab = setTab;
	}
	
	vm.isSelected = function(checkTab){
	    return vm.tab === checkTab;
	}

	vm.studyLocation = {
	    building: "",
	    roomNum: "",
	    maxCapacity: ""
	}

	vm.username = "";
    }
})();
