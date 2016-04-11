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
		reporter: "User 1",
		recipient: "User 2",
		message: "This user was not participating in group discussions.",
	    },
	    
	    {
		code: "222",
		date: "mm/dd/yyyy",
		reporter: "User 3", 
		recipient: "User 4",
		message: "This user was unnecessarily reporting other users.",
	    },
	    
	    {
		code: "333",
		date: "mm/dd/yyyy",
		reporter: "User 5",
		recipient: "User 6",
		message: "This user is not attending any meetings.",
	    },
	    
	    {
		code: "444",
		date: "mm/dd/yyyy",
		reporter: "User 7",
		recipient: "User 8",
		message: "This user is being disruptive.",
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

	vm.buildings = ["Sherman", "ITE", "Engineering", "Biology"];

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
