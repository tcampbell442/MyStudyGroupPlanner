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

	vm.usernameTemp = "";

	vm.messages = [
	    {
		'username': 'username1',
		'content': 'Hi!'
	    },
	    {
		'username': 'username2',
		'content': 'Hello!'
	    },
	    {
		'username': 'username2',
		'content': 'Hello!'
	    },
	    {
		'username': 'username2',
		'content': 'Hello!'
	    },
	    {
		'username': 'username2',
		'content': 'Hello!'
	    },
	    {
		'username': 'username2',
		'content': 'Hello!'
	    }
	];

	vm.username = 'username1';
	
	vm.sendMessage = function(message, username) {
	    if(message && message !== '' && username) {
		vm.messages.push({
		    'username': username,
		    'content': message
		});
	    }
	};
	vm.visible = true;
	vm.expandOnNew = true;
	
    }
})();
