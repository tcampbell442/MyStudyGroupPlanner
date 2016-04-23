/**
* GroupMemberController controller
* @namespace myStudyGroupPlanner.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner')
    .controller('GroupMemberController', GroupMemberController);

  GroupMemberController.$inject = ['$location', '$scope', 'Authentication', '$http', '$routeParams', '$filter'];

  /**
  * @namespace
  */
  function GroupMemberController($location, $scope, Authentication, $http, $routeParams, $filter) {
    var vm = this;

    /** Will need to know current user for chat/reports/leave group ***NOT CURRENTLY BEING USED IN CHAT/REPORTING*** */
    vm.thisUser = Authentication.getAuthenticatedAccount();
    /** used to set which user to remove when you click the remove button */
    vm.removeUserObj = {};  
    vm.removeUserObj = {"id":vm.thisUser.id, "username":vm.thisUser.username};   
    /** Used in a ng-hide on groupMember.html to hide contents until redirect to home if user not member */
    vm.userAMember = false;
    
    /** displayed in leave group modal */
    vm.leaveGroupStatus = "";
    /** used to check if leave group had errors */
    vm.leaveGroupSuccess = true;
    
    
    /** GROUP CREATOR ONLY VARIABLES */
    /** -------------------------- */
	vm.isCreator = false;
	vm.meetingCreateStatus = "";
	
	vm.meetingTitle = "";
	vm.selectedBuilding = "";
	vm.selectedRoom ="";
	vm.startTime = new Date();
	vm.endTime = new Date();
	vm.meetingComments = ""; 
	
	vm.buildings = ["Information Technology of Engineering",
		           "Sherman Hall","Arts and Humanities",
		           "Biological Science"];
	vm.rooms = ["102","202","303","505"];	
    /** ------------------------- */
    
    
    vm.reportFields = {
      reporteeName : "",
      reporteeName : "",
      reportComments : "",
      date : ""
    }

	vm.messages = [];
    vm.chatFields = {
      message: ""
    }

	vm.date = new Date();
    /** Will contain all entries in the msgpUser table.  Used to get user and group ids and names, plus meeting ids */
    vm.msgpUserAll = [];
    /** Loads the groups id which is in the URL as the first (and only) parameter */
    vm.groupId = $routeParams.groupId;
    /** Gets set to json object containing info on current group */
    vm.groupInfo = {};
    /** List of user objects that belong to this group, taken from vm.msgpUserAll 
        This is used to ng-repeat through users on the groupMember page Members list*/
	vm.groupUsers = [];


	/**------------------------------------------*/
	/** Gets all listings in the msgpUser table that contains user-group-meetingId info */
	/**------------------------------------------*/
    vm.getGroupsData = function() {

		vm.groupUsers = [];

    	$http({method: 'GET',
			url: '/api/msgpUser/'})
			.then(function(response){
				
				vm.msgpUserAll = response.data;	
				
				/** Remove all entries from msgpUserAll list that are not related to this group */
				for (var i = vm.msgpUserAll.length-1; i >= 0; i--) {
					if (vm.msgpUserAll[i].msgpGroupId != vm.groupId)
						vm.msgpUserAll.splice(i,1);
				}
				
				/** Run function to verify user is in this group */
				vm.checkIfUserIsMember();
				
				/** groupUserIds is a temporary list of ids used to ensure only 
				    unique users added to vm.groupUsers in for loop below*/
				var groupUserIds = [];
				
				/** add users of this group to vm.groupUsers */
				for (var i = 0; i < vm.msgpUserAll.length; i++) {
					if (groupUserIds.indexOf(vm.msgpUserAll[i].msgpUserId) <= -1) {
						groupUserIds.push(vm.msgpUserAll[i].msgpUserId);
						vm.groupUsers.push(vm.msgpUserAll[i]);
					}
				}
				
			},
			function(response){
				/**vm.status = "failed";*/
		});

    }


	/**------------------------------------------*/
	/** Gets this specific group's info from group table */
	/**------------------------------------------*/
	vm.getGroupInfo = function() {

    	$http({method: 'GET',
			url: '/api/group/' + vm.groupId + '/'})
			.then(function(response){
				vm.groupInfo = response.data;
				
				/** check if current user is creator */
				if (vm.groupInfo.groupOwner == vm.thisUser.username)
					vm.isCreator = true;
			},
			function(response){
				/**vm.status = "failed";*/
		});

    }

	/**------------------------------------------*/
	/** Looks through msgpUser table to see if user is part
	    of this group. If not redirect to home */
	/**------------------------------------------*/
	vm.checkIfUserIsMember = function() {
	
		vm.userAMember = false;
				
		for (var i = 0; i < vm.msgpUserAll.length; i++) {
			/** checks all entries in msgpUser for one with userId and this group's id */
			if (vm.msgpUserAll[i].msgpUserId == vm.thisUser.id && vm.msgpUserAll[i].msgpGroupId == vm.groupId) {
				vm.userAMember = true;
				break;	
			}	
		}
		/** if an entry is not found redirect user to home page. */
		if (vm.userAMember == false)
			vm.changeUserURL('/home');
	}
	
	
	/**------------------------------------------*/
	/** check if user is creator -- Used to ng-hide remove button on members list
	    Creator should not be able to remove themselves (they can leave group) */
	/**------------------------------------------*/
	vm.isUserCreator = function(userId) {
		if (vm.isCreator == true) {
			if (userId == vm.thisUser.id)
				return true;
			else
				return false;
		}
	}
	
	/**------------------------------------------*/
	/** Changes current users url to specified url */
	/**------------------------------------------*/
	vm.changeUserURL = function(url) {
		$location.path(url).replace();
	}	

	/**------------------------------------------*/
	/** Sets vm.removeUserObj either to current user or the user creator is trying to remove */
	/**------------------------------------------*/
	vm.setUserLeavingGroup = function(userObj) {
		if (userObj != null)
			vm.removeUserObj = {"id":userObj.msgpUserId, "username":userObj.msgpUsername};
	}

	/**------------------------------------------*/
	/** Have specified user leave current group */
	/**------------------------------------------*/
	vm.leaveGroup = function() {
		
		/** Need to delete ALL msgpUSer entries with current user.  There may be
		    multiple, a new one is created every time a meeting is created */		
		for (var i = vm.msgpUserAll.length-1; i >= 0; i--) {
		
			/** only look to modify entries about current user */
			if (vm.msgpUserAll[i].msgpUserId == vm.removeUserObj.id) {
				
				/** check if this msgpUSer entry has a meetingId */
				if (vm.msgpUserAll[i].msgpMeetingId != null) {
					
					/** if meetingId exists, update meeting member count and delete if it will become zero */
					$http({method: 'GET',
			  			url: '/api/meeting/' + vm.msgpUserAll[i].msgpMeetingId + '/',
			  		})
			  		.then(function(meetingGetResponse){
			  			
			  			/** Delete meeting if current members attending is 1 */
			  			if (meetingGetResponse.data.users_attending <= 1) {
			  				$http({method: 'DELETE',
					  		   url: '/api/meeting/' + meetingGetResponse.data.id + '/',
					  		})
					  		.then(function(deleteResponse){
					  			
					  		},
					  		function(deleteResponse){
					  			/** request failed */
					  			vm.leaveGroupSuccess = false;
					  		});
			  			}
			  			else {
			  				
			  				var newAttendingCount = meetingGetResponse.data.users_attending;
			  				newAttendingCount = newAttendingCount - 1;
			  				
			  				/** Update meeting users_attending column by subtracting 1 */
							$http({method: 'PATCH',
								url: '/api/meeting/' + vm.msgpUserAll[i].msgpMeetingId + '/',
								data: {
									users_attending: newAttendingCount
								}
							})
							.then(function(patchResponse){
							
							},
							function(patchResponse){
								/** request failed */
								vm.leaveGroupSuccess = false;
							});
			  			}
			  				
			  		},
			  		function(meetingGetResponse){
			  			/** request failed */
			  			vm.leaveGroupSuccess = false;
			  		});
						
				} /** END if (meetingId!=null) */
				
				
				/** delete msgpUser table entry IF ASSOCIATED WITH THIS GROUP ONLY*/
				if (vm.msgpUserAll[i].msgpGroupId == vm.groupId) {
				
					/** clear msgpGroupId so another DELETE request won't happen on it 
						below in group DELETE request's .then function */
					vm.msgpUserAll[i].msgpGroupId = null;
				
					$http({method: 'DELETE',
			  		   url: '/api/msgpUser/' + vm.msgpUserAll[i].id + '/',
			  		})
			  		.then(function(deleteMSGPUserResponse1){
			  			
			  		},
			  		function(deleteMSGPUserResponse1){
			  			/** request failed */
			  			vm.leaveGroupSuccess = false;
			  		});
		  		}
		  		
		  	} /** END if (msgpUser.Id==vm.thisUser.id) */
  		} /** END for loop */
  		
  		/** Then need to update group table entry, subtracting 1 from memberCount if memberCount > 1
  		    else need to delete group and all msgpUser table entries associated with it*/
		$http({method: 'GET',
			url: '/api/group/' + vm.groupId + '/'})
		.then(function(groupGetResponse){
			
			if (groupGetResponse.data.memberCount <= 1 || groupGetResponse.data.groupOwner == vm.removeUserObj.username) {
				
				/** delete group table entry */
				$http({method: 'DELETE',
		  		   url: '/api/group/' + groupGetResponse.data.id + '/',
		  		})
		  		.then(function(deleteGroupResponse){
		  			/** delete all msgpUser table entries associated with this now deleted group */
		  			for (var i = vm.msgpUserAll.length-1; i >= 0; i--) {
		  				
		  				if (vm.msgpUserAll[i].msgpGroupId == vm.groupId) {
		  					
							/** delete msgpUser table entry */
							$http({method: 'DELETE',
							   url: '/api/msgpUser/' + vm.msgpUserAll[i].id + '/',
							})
							.then(function(deleteMSGPUserResponse2){
								
							},
							function(deleteMSGPUserResponse2){
								/** request failed */
								vm.leaveGroupSuccess = false;
							});
		  					
		  					/** Delete meetings associated with this group */
		  					
		  					
		  					
		  				} /** END if */
		  			} /** END for loop */
		  			
		  			/** redirect to homepage if no errors and user leaving is current user*/
					if (vm.leaveGroupSuccess)
						if (vm.thisUser.id == vm.removeUserObj.id)
							vm.changeUserURL('/home');
						else {
							vm.getGroupsData();
						}
					else
						vm.leaveGroupStatus = "Error: Leaving group did not function properly.";
		  		},
		  		function(deleteGroupResponse){
		  			/** request failed */
		  			vm.leaveGroupSuccess = false;
		  		});
				
			}
			else {
			  				
				/** update groups memberCount column by subtracting 1 */
				$http({method: 'PATCH',
					url: '/api/group/' + vm.groupId + '/',
					data: {
						memberCount: groupGetResponse.data.memberCount - 1
					}
				})
				.then(function(patchResponse){
					/** redirect to homepage if no errors  and user leaving is current user*/
					if (vm.leaveGroupSuccess)
						if (vm.thisUser.id == vm.removeUserObj.id)
							vm.changeUserURL('/home');
						else {
							vm.getGroupsData();
						}
					else
						vm.leaveGroupStatus = "Error: Leaving group did not function properly.";
				},
				function(patchResponse){
					/** request failed */
					vm.leaveGroupSuccess = false;
				});
			}
				
		},
		function(groupGetResponse){
			/** request failed */
			vm.leaveGroupSuccess = false;
		});
						
	} /** END vm.leaveGroup() */
	
	
	
	/**------------------------------------------*/
	/** Reporting POST function */
	/**------------------------------------------*/
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


	/**------------------------------------------*/
	/** Chat GET AND POST functions */
	/**------------------------------------------*/
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


	/**------------------------------------------*/
	/** Meeting POST function */
	/**------------------------------------------*/
	vm.createMeeting = function() {
		/**var startTime = $filter('date')(vm.startTime, 'H:mm');*/
		
		$http({method: 'POST',
  		url: '/api/meeting/',
  		data: {
  			title: vm.meetingTitle,
			building: vm.selectedBuilding,
			room_num: vm.selectedRoom,
			start_time: vm.startTime,
			end_time: vm.endTime,
			users_attending: 1,
			groupId: vm.groupId,
			comment: vm.meetingComments
  			}
  		})
  		.then(function(meetingResponse){
  		
  			/** Upon successful post, need to add new entry to msgpUser table */
  			$http({method: 'POST',
			url: '/api/msgpUser/',
			data: {
				msgpUserId: vm.thisUser.id,
				msgpUsername: vm.thisUser.username,
				msgpGroupId: vm.groupInfo.id,
				msgpGroupName: vm.groupInfo.groupName,
				msgpMeetingId: meetingResponse.data.id
				}
			})
			.then(function(msgpUserResponse){		
				/** msgpUser POST success */
				
				/** Load/update all entries from the msgpUser table 
				    as there is a new one now*/
				vm.getGroupsData();
			},
			function(msgpUserResponse){
				/**msgpUser POST failed*/
			});
  			
  		},
  		function(meetingResponse){
  			/** meeting POST failed */
  		});
	    
	}


	/** Load info on current group */
	vm.getGroupInfo();
	/** Load all entries from the msgpUser table */
	vm.getGroupsData();

  }

})();
