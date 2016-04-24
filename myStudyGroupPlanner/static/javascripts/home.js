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
    
    /** store current user (Account) object */
    vm.thisUser = Authentication.getAuthenticatedAccount();

	vm.date = new Date();
	vm.status = "";
	vm.msgpUserAll = [];
	vm.allGroups = [];
	
	/** Used to store ids of groups from group table current user is a part of*/
	vm.userGroups = [];
	

	/** search parameters/filters */
	vm.selectedSubject = "";
	vm.selectedClass = "";
	vm.selectedSection = "";
	
	/** order search results by this variable.  Set when clicking on table column titles */
	vm.orderResultsBy = "";
	/** group availability in group search results. */
	vm.groupAvailability = "";

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

	/** used to store meeting objects for meetings user is involved with */
	vm.currentMeetings = [];
	

	/** ------------------------------------------------ */
	/** Sets current activated tab                       */
	/** ------------------------------------------------ */
	vm.selectTab = function(setTab) {
		vm.tab = setTab;
	}
	
	/** ------------------------------------------------ */
	/** Checks if activated tab is equal to tab passed 
	    in as parameter                                  */
	/** ------------------------------------------------ */
	vm.isSelected = function(checkTab) {
		return vm.tab === checkTab;
	}
	
	
	/** ------------------------------------------------ */
	/** Create New Group with user as the group owner.  
	    Also when first POST response is received it calls
	    a second POST to create new msgpUser which is 
	    USER-GROUP table                                 */
	/** ------------------------------------------------ */
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
	
	
	/** ------------------------------------------------ */
	/**  Get all user-groups info                        */
	/** ------------------------------------------------ */
	vm.getGroups = function() {
	
		/** Currently no filtering django side, GETS all objects so angular can filter client side */
		$http({method: 'GET',
			url: '/api/msgpUser/'})
			.then(function(response){
			/** response is a list of msgpUser json objects, contains user AND group data, plus meeting id*/
				vm.msgpUserAll = response.data;
				/** load user's meetings */
				vm.loadUserMeetings();
			},
			function(response){
				/**vm.status = "failed";*/
		});
	}
	
	
	/** ------------------------------------------------ */
	/** This runs when you click search button in group 
	    search tab                                       */
	/** ------------------------------------------------ */
	vm.searchGroups = function() {
		vm.showSearchResults = true;
		vm.getAllGroups();
	}
	
	
	/** ------------------------------------------------ */
	/** This runs when you click new search button in 
	    group search results                             */
	/** ------------------------------------------------ */
	vm.resetGroupSearch = function() {
		vm.showSearchResults = false;
		vm.selectedSubject = "";
		vm.selectedClass = "";
		vm.selectedSection = "";
	}	
	
	
	/** ------------------------------------------------ */
	/**  Get group table entries                         */
	/** ------------------------------------------------ */
	vm.getAllGroups = function() {
	
		/** GET request all objects from group table */
		$http({method: 'GET',
			url: '/api/group/'})
			.then(function(response){
				vm.allGroups = response.data;
			},
			function(response){
				
		});
	}	
	
	
	/** ------------------------------------------------ */
	/** sets how search results should be sorted.  Not sorted by default right now... */
	/** ------------------------------------------------ */
	vm.setOrderBy = function(column) {
		if (vm.orderResultsBy == column)
			vm.orderResultsBy = '-' + column;
		else
			vm.orderResultsBy = column;
	}
	
	
	/** ------------------------------------------------ */
	/** check if user in a specific group by checking 
	    msgpUser table.  Return ids list from group table*/
	/** Generates list of group ids user is a part of.  
	    This list is used in group search join button 
	    functionality                                    */
	/** ------------------------------------------------ */ 
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
	
	
	/** ------------------------------------------------ */
	/** Check if group id is one user has joined 
	     -- ALSO CHECKS IF GROUP IS NOT FULL             */
	/** ------------------------------------------------ */
	vm.checkIfAvailable = function(groupId, groupMemberCount, groupMaxMembers) {
		if (vm.userGroups.indexOf(groupId) > -1) {
			vm.groupAvailability = "IN GROUP";
			return true;
		}
		else if (groupMemberCount >= groupMaxMembers) {
			vm.groupAvailability = "FULL";
			return true;
		}
		else {
			return false;
		}
	}
	
	
	/** ------------------------------------------------ */
	/** Load meetings for the current user only. 
	    to be displayed in meetings                      */
	/** ------------------------------------------------ */
	vm.loadUserMeetings = function() {
		
		for (var i = 0; i < vm.msgpUserAll.length; i++) {

			if (vm.msgpUserAll[i].msgpUserId == vm.thisUser.id && 
					vm.msgpUserAll[i].msgpMeetingId != null) {
				
				$http({method: 'GET',
				url: '/api/meeting/' + vm.msgpUserAll[i].msgpMeetingId + '/'})
				.then(function(meetingResponse){
				
					/** groupName is not stored in meetings table, need to get
					    it and add it to meetingResponse object */
					$http({method: 'GET',
					url: '/api/group/' + meetingResponse.data.groupId + '/'})
					.then(function(groupResponse2){
						
						meetingResponse.data["groupName"] = groupResponse2.data.groupName;
						vm.currentMeetings.push(meetingResponse.data);
						
					},
					function(groupResponse2){
					
					});
				
				},
				function(meetingResponse){
					
				});
			}

		}
	}
	
	
	/** ------------------------------------------------ */
	/** Check if group id is one user has joined         */
	/** ------------------------------------------------ */
	vm.joinGroup = function(groupId, groupName) {
		
		$http({method: 'GET',
					url: '/api/group/' + groupId + '/',
				})
				.then(function(getResponse){
					
					if (getResponse.data.memberCount < getResponse.data.totalMembersAllowed) {
					
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
				
							/** update group's memberCount */		
							$http({method: 'PATCH',
								url: '/api/group/' + groupId + '/',
								data: {
									memberCount: getResponse.data.memberCount + 1
									}
								})
								.then(function(patchResponse){
									/** update list of groups being used to filter group search */
									vm.getAllGroups();
								},
								function(patchResponse){
									/** request failed */
								});			
				
						},
						function(response2){
							/** request failed */
						});
					
					} /** END IF */
				},
				function(getResponse){
					/** request failed */
				});
		
	} /** END vm.joinGroup() */
	
	
	/** Functions to run on page load */
	/** ----------------------------------------------------------- */
	/** Call getGroups() helper function one time initially to display user's current groups */
	vm.getGroups();
	/** Call this to get list of group ids from group table user is a part of */
	vm.getUserGroups();
	/** sets default group search sorting by member count */
	vm.setOrderBy('-memberCount');
	
	/** Load current user's meetings ### CALLED IN .THEN FUNCTION OF vm.getGroups() ### */
	
	/** ----------------------------------------------------------- */
	
  }
})();
