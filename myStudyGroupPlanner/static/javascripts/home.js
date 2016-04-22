/**
* Home controller
*
*/
(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$location', '$scope', 'Authentication', '$http'];

  /**
  * @namespace HomeController
  */
  function HomeController($location, $scope, Authentication, $http) {
    var vm = this;
    
    vm.thisUser = Authentication.getAuthenticatedAccount();

	vm.date = new Date();
	vm.status = "";
	vm.currentGroups = [];
	vm.allGroups = [];
	
	/** Used to store ids of groups from group table current user is a part of*/
	vm.userGroups = [];
	

	/** search parameters/filters */
	vm.selectedSubject = "";
	vm.selectedClass = "";
	vm.selectedSection = "";
	
	/** order search results by this variable.  Set when clicking on table column titles */
	vm.orderResultsBy = "";

	/** Variable used to track activated tab */
    vm.tab = 1;
    /** Variable tracks if search results should be showed */
    vm.showSearchResults = false;
    /** Create Group Tab variables */
    vm.groupFields = {
    	groupIdentifier: 0,
    	groupName: "",
    	groupSubject: "",
    	groupClass: "",
    	groupSection: "",
    	groupMaxMembers: 30
    }


	/** Hardcoded Search tab data.  CHANGE TO DJANGO MODEL DATA */
	vm.selectedSubject = "";
	vm.subjects = ["Art", "Business", "English", "Geography", "History", "Math", "Music", "Science"];
	vm.selectedClass = "";
	vm.classes = ["CMSC101", "CMSC102", "CMSC201", "CMSC202", "CMSC313", "CMSC331", "CMSC447"];
	vm.selectedSection;
	vm.sections = [1,2,3,4];

	
	/**  Hardcoded Upcoming Meetings tab data.  CHANGE TO DJANGO MODEL DATA */
	vm.calendarDate = "March 5";
	vm.currentMeetings = [["MeetingName1", "GroupName1", "Time 7:00pm to 12:00am", "Location: RLC"], ["MeetingName2", "GroupName3", "Time 6:00pm to 9:00pm", "Location: Sherman 151"]];

	/** Sets current activated tab */
	vm.selectTab = function(setTab) {
		vm.tab = setTab;
	}
	/** Checks if activated tab is equal to tab passed in as parameter */
	vm.isSelected = function(checkTab) {
		return vm.tab === checkTab;
	}
	/** Create New Group with user as the group owner.  Also when first POST response 
	    is received it calls a second POST to create new msgpUser which is USER-GROUP table */
	vm.createGroup = function() {		
		
		/** CREATE NEW GROUP */
		$http({method: 'POST',
		url: '/api/group/',
		data: {
			groupName: vm.groupFields.groupName,
			subject: vm.groupFields.groupSubject,
			className: vm.groupFields.groupClass,
			section: vm.groupFields.groupSection,
			groupOwner: vm.thisUser.username,
			memberCount: 1,
			totalMembersAllowed: vm.groupFields.groupMaxMembers
			}
		})
		.then(function(response){
			vm.status = "Group Created";
			vm.userGroups.push(response.data.id);
			
			/** CREATE NEW USER-GROUP-REPORT ENTRY (msgpUser table) */
			$http({method: 'POST',
			url: '/api/msgpUser/',
			data: {
				msgpUserId: vm.thisUser.id,
				msgpUsername: vm.thisUser.username,
				msgpGroupId: response.data.id,
				msgpGroupName: response.data.groupName
				}
			})
			.then(function(response2){		
				/**vm.status = "";*/
				vm.getGroups();
			},
			function(response2){
				/**vm.status = "";*/
			});
			
		},
		function(response){
			vm.status = "Failed to create group.";
		});

	}
	
	/**  Get groups specific to current user */
	vm.getGroups = function() {
	
		/** Currently no filtering django side, GETS all objects so angular can filter client side */
		$http({method: 'GET',
			url: '/api/msgpUser/'})
			.then(function(response){
			/** response is a msgpUser json object, contains user AND group data */
				vm.currentGroups = response.data;
			},
			function(response){
				/**vm.status = "failed";*/
		});
	}


	vm.searchGroups = function() {
		vm.showSearchResults = true;
		vm.getAllGroups();
	}
	
	/**  Get groups specific to current user */
	vm.getAllGroups = function() {
	
		/** Currently no filtering django side, GETS all objects so angular can filter client side */
		$http({method: 'GET',
			url: '/api/group/'})
			.then(function(response){
			/** response is a msgpUser json object, contains user AND group data */
				vm.allGroups = response.data;
			},
			function(response){
				/**vm.status = "failed";*/
		});
	}	
	

	/** sets how search results should be sorted.  Not sorted by default right now... */
	vm.setOrderBy = function(column) {
		if (vm.orderResultsBy == column)
			vm.orderResultsBy = '-' + column;
		else
			vm.orderResultsBy = column;
	}
	
	/** check if user in a specific group by checking msgpUser table.  Return list of ids from group table */
	/** Generates list of group ids user is a part of.  This list is used in group search join button functionality */ 
	vm.getUserGroups = function() {
			
		$http({method: 'GET',
			url: '/api/msgpUser/'})
			.then(function(response){
				for (var i = 0; i < response.data.length; i++) {
					/** save groupId to userGroups if not already added*/
					if (response.data[i].msgpUserId == vm.thisUser.id) {
						if (vm.userGroups.indexOf(response.data[i].msgpGroupId) == -1)
							vm.userGroups.push(response.data[i].msgpGroupId);	
					}	
				}
			},
			function(response){
				
		});
	}
	
	/** Check if group id is one user has joined */
	vm.checkIfInGroup = function(groupId) {
		if (vm.userGroups.indexOf(groupId) > -1)
			return true;
		else
			return false;
	}
	
	
	/** Check if group id is one user has joined */
	vm.joinGroup = function(groupId, groupName) {
		
		$http({method: 'POST',
			url: '/api/msgpUser/',
			data: {
				msgpUserId: vm.thisUser.id,
				msgpUsername: vm.thisUser.username,
				msgpGroupId: groupId,
				msgpGroupName: groupName
				}
			})
			.then(function(response2){		
				vm.getGroups();
				vm.userGroups.push(groupId);
			},
			function(response2){
				
			});
		
	}
	

	/** Call getGroups() helper function one time initially to display user's current groups */
	vm.getGroups();
	/** Call this to get list of group ids from group table user is a part of */
	vm.getUserGroups();
  }
})();
