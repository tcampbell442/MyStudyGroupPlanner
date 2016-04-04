/**
* Home controller
* @namespace myStudyGroupPlanner.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace HomeController
  */
  function HomeController($location, $scope, Authentication) {
    var vm = this;
	
	/** Variable used to track activated tab */
    vm.tab = 1;
    /** Variable tracks if search results should be showed */
    vm.showSearchResults = false;
    /** Create Group Tab variables */
    vm.createGroup = {
    	groupIdentifier: 0,
    	groupName: "",
    	groupSubject: "",
    	groupClass: "", 
    	groupSection: "",
    	groupMaxMembers: 30,
    	groupAccessType: 2,  /** 0 private, 1 closed, 2 public */
    	groupPermissionLevel: 0  /** 0 creator, 1 creator/creator nominated, 2 anyone */
    }
    /** Join Private Group Tab variables */
    vm.privateCodeToSubmit = 0;
	
	/** Hardcoded Search tab data.  CHANGE TO DJANGO MODEL DATA */
	vm.selectedSubject = "";	
	vm.subjects = ["Art", "Business", "English", "Geography", "History", "Math", "Music", "Science"];
	vm.selectedClass = "";	
	vm.classes = ["CMSC101", "CMSC102", "CMSC201", "CMSC202", "CMSC313", "CMSC331", "CMSC447"];
	vm.selectedSection = "";	
	vm.sections = ["001", "002", "003", "004"];
	
	/** Hardcoded Search Result data.  CHANGE TO DJANGO MODEL DATA */
	vm.searchResults = [["98423", "Gary's Study Group", "Gary", "10", "open", "join"], 
						["46634", "CMSC447-002 Main", "Sue", "30", "closed", "request"]];
	

	/**  Hardcoded Groups tab data.  CHANGE TO DJANGO MODEL DATA */
	vm.currentGroups = ["GroupName0", "GroupName1", "GroupName2"];
	/**  Hardcoded Upcoming Meetings tab data.  CHANGE TO DJANGO MODEL DATA */
	vm.calendarDate = "March 5";
	vm.currentMeetings = [["MeetingName1", "GroupName1", "Time 7:00pm to 12:00am"], ["MeetingName2", "GroupName3", "Time 6:00pm to 9:00pm"]];

	/** Sets current activated tab */
	vm.selectTab = function(setTab) {
		vm.tab = setTab;
	}
	/** Checks if activated tab is equal to tab passed in as parameter */
	vm.isSelected = function(checkTab) {
		return vm.tab === checkTab;
	}
	/**  */
	

  }
})();
