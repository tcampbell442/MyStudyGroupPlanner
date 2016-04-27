/**
* GroupMemberController controller
* @namespace myStudyGroupPlanner.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner')
    .controller('GroupMemberController', GroupMemberController);

  GroupMemberController.$inject = ['$location', '$scope', 'Authentication', '$http', '$routeParams', '$filter', '$timeout', '$q'];

  /**
  * @namespace
  */
  function GroupMemberController($location, $scope, Authentication, $http, $routeParams, $filter, $timeout, $q) {

    var vm = this;

    /** used to load calendar.html, refreshed after loading meetings info */
    vm.calendarHTML = '';
    /** used to include meetingModal.html */
    vm.meetingModalHTML = '/static/templates/meetingModal.html';

    /** stores meetings day/month start date info in comma seperated string */
    vm.meetings = "";

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
    /** used to store meeting objects for meetings group is involved with */
	vm.currentGroupMeetings = [];
	vm.filteredMeetings = [];
	vm.meetingToModify = {};

    /** GROUP CREATOR ONLY VARIABLES */
    /** ------------------------------------ */
	vm.isCreator = false;
	vm.meetingCreateStatus = "";

	vm.meetingTitle = "";
	vm.selectedBuilding = "";
	vm.selectedRoom ="";
	vm.startTime = new Date();
	vm.endTime = new Date();

	vm.meetingComments = "";
	vm.meetingCreationStatus = "";

	vm.buildings = ["Information Technology of Engineering",
		           "Sherman Hall","Arts and Humanities",
		           "Biological Science"];
	vm.rooms = ["102","202","303","505"];
    /** ------------------------------------ */


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

	/** vm.date used to save calendar's selected date */
	vm.date = new Date();
	vm.firtMeetingFiltering = true;
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
	/** sets the default create meeting start/end
	    times                                    */
	/**------------------------------------------*/
	vm.setDefualtMeetingInfo = function() {

		vm.startTime.setHours(12);
		vm.startTime.setMinutes(0);
		vm.startTime.setSeconds(0);
		vm.startTime.setMilliseconds(0);

		vm.endTime.setHours(12);
		vm.endTime.setMinutes(0);
		vm.endTime.setSeconds(0);
		vm.endTime.setMilliseconds(0);
		
		vm.meetingTitle = "";
		vm.selectedBuilding = "";
		vm.selectedRoom ="";
		vm.meetingComments = "";
		vm.meetingCreationStatus = "";
	}


	/**------------------------------------------*/
	/** Gets all listings in the msgpUser table
	    that contains user-group-meetingId info  */
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

				/** load meetings for current group */
				vm.loadGroupMeetings();

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
	/** Gets this specific group's info from
	    group table                              */
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
	/** Looks through msgpUser table to see if
	    user is part of this group. If not
	    redirect to home                         */
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
	/** check if user is creator -- Used to ng-hide
	    remove button on members list Creator should
	    not be able to remove themselves (they can
	    leave group still)                       */
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
	/** Changes current users url to specified url*/
	/**------------------------------------------*/
	vm.changeUserURL = function(url) {
		$location.path(url).replace();
	}

	/**------------------------------------------*/
	/** Sets vm.removeUserObj either to current user
	    or the user creator is trying to remove  */
	/**------------------------------------------*/
	vm.setUserLeavingGroup = function(userObj) {
		if (userObj != null)
			vm.removeUserObj = {"id":userObj.msgpUserId, "username":userObj.msgpUsername};
	}

	/**------------------------------------------*/
	/** Have specified user leave current group  */
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
					  		.then(function(deleteMeetingResponse){

					  		},
					  		function(deleteMeetingResponse){
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
						vm.msgpUserAll.splice(i,1);
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

		  			/** contains list of ids of meetings associated with this group, used to
		  			    delete them from meeting table after deleting all msgpUser related entries */
		  			var meetingsToDelete = [];

		  			/** delete all msgpUser table entries associated with this now deleted group. */
		  			for (var i = vm.msgpUserAll.length-1; i >= 0; i--) {

		  				if (vm.msgpUserAll[i].msgpGroupId == vm.groupId) {

		  					/** msgpUser table may have multiple entries with same meetingId
		  					    This approach is used to avoid duplicate delete attempts  */
		  					if (vm.msgpUserAll[i].msgpMeetingId != null) {
		  						if (meetingsToDelete.indexOf(vm.msgpUserAll[i].msgpMeetingId) <= -1)
									meetingsToDelete.push(vm.msgpUserAll[i].msgpMeetingId);
		  					}

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

		  				} /** END if */
		  			} /** END for loop */

		  			/** delete all meetings that were still associated with this group */
					for (var i = 0; i < meetingsToDelete.length; i++) {

						/** delete meeting table entry */
							$http({method: 'DELETE',
							   url: '/api/meeting/' + meetingsToDelete[i] + '/',
							})
							.then(function(deleteMeetingResponse2){

							},
							function(deleteMeetingResponse2){
								/** request failed */
								vm.leaveGroupSuccess = false;
							});
					}

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



	/** ------------------------------------------------ */
	/** Validates requested meeting time for selected
	    building + room.  Blocks times into hours 
	    regardless of the requested start/end minutes    */
	/** ------------------------------------------------ */
	vm.restrictMeetingOverlap = function() {
		
		if (parseInt(vm.startTime.getDate()) <= parseInt(vm.endTime.getDate()) && (parseInt(vm.endTime.getDate()) - parseInt(vm.startTime.getDate())) <= 1 && parseInt(vm.startTime.getHours()) < parseInt(vm.endTime.getHours())) {
		
			$http({method: 'GET',
				url: '/api/meeting/'})
			.then(function(meetingResponse){
			
				var validTime = true;
			
				var requestedStartHour;
				var requestedEndHour;
				var tempStartHour;
				var tempEndHour;
				var requestedStartDate;
				var tempStartDate;
				var conflictMessage = "Timing Conflict: Meeting already scheduled for room# ";
				var correctedStartTime = "";
				var correctedEndTime = "";
				
				
				for (var i = 0; i < meetingResponse.data.length; i++) {
				
					/**alert("" + String(meetingResponse.data[i].building) + " " + String(vm.selectedBuilding) + "-" + String(meetingResponse.data[i].room_num) + " " + String(vm.selectedRoom) );*/
					
					/** Check if building and room num are the same */
					if (meetingResponse.data[i].building == vm.selectedBuilding && meetingResponse.data[i].room_num == vm.selectedRoom) {
						
							requestedStartDate = parseInt(vm.startTime.getDate());
							tempStartDate = parseInt(String(meetingResponse.data[i].start_time).substring(8,10));
						
						/** check if start dates are the same */
						if (requestedStartDate == tempStartDate) {
						
							requestedStartHour = parseInt(vm.startTime.getHours());
							requestedEndHour = parseInt(vm.endTime.getHours());
							tempStartHour = parseInt(String(meetingResponse.data[i].start_time).substring(11,13)) - 4;
							tempEndHour = parseInt(String(meetingResponse.data[i].end_time).substring(11,13)) - 4;
							
							if (tempStartHour >= 12 && tempStartHour < 24)
								correctedStartTime = "" + String(tempStartHour - 12) + "pm";
							else
								correctedStartTime = "" + String(tempStartHour) + "am";
							if (tempEndHour >= 12 && tempEndHour < 24)
								correctedEndTime = "" + String(tempEndHour - 12) + "pm";
							else
								correctedEndTime = "" + String(tempEndHour) + "am";
							
							conflictMessage += vm.selectedRoom + " from " + correctedStartTime + " to " + correctedEndTime;
							/**alert("" + String(requestedStartHour) + " " + String(requestedEndHour) + " " + String(tempStartHour) + " " + String(tempEndHour));*/
				
							/** Check the four cases where 1hr block timing conflicts occur */
							if (requestedStartHour >= tempStartHour && requestedEndHour <= tempEndHour) {
								validTime = false;
								break;
							}
							else if (requestedEndHour > tempStartHour && requestedEndHour <= tempEndHour) {
								validTime = false;
								break;
							}
							else if (requestedStartHour >= tempStartHour && requestedStartHour <= tempEndHour) {
								validTime = false;
								break;
							}
							else if (requestedStartHour <= tempStartHour && requestedEndHour > tempStartHour) {	
								validTime = false;
								break;
							}
						}
					}
				}
			
				if (validTime == true)
					vm.createMeeting([true, "Meeting Created.  Click close to exit."]);
				else
					vm.createMeeting([false, conflictMessage]);
			},
			function(meetingResponse){
				vm.createMeeting([false, "Error."]);
			});
		
		}
		/** invalid input */
		else
			vm.createMeeting([false, "Invalid date/time selected."]);

	}	



	/** ------------------------------------------------ */
	/** Load meetings for the current group only.
	    to be displayed in meetings                      */
	/** ------------------------------------------------ */
	vm.loadGroupMeetings = function() {

		/** clear calendar before refreshing it */
		vm.calendarHTML = '';

		vm.meetings = "";
		vm.currentGroupMeetings = [];
		vm.filteredMeetings = [];

		/** temporary list of meeting ids */
		var uniqueMeetingIds = [];
		var day = "";
		var month = "";
		var year = "";

		vm.promiseList = [];

		for (var i = 0; i < vm.msgpUserAll.length; i++) {

			if (vm.msgpUserAll[i].msgpMeetingId != null) {

				/** get meeting info from meeting table */
				vm.promiseList.push($http({method: 'GET',
				url: '/api/meeting/' + vm.msgpUserAll[i].msgpMeetingId + '/'})
				.then(function(meetingResponse){

					/** add meeting object to groups meetings list, to be used in meetings window */
					vm.currentGroupMeetings.push(meetingResponse.data);
					vm.filteredMeetings.push(meetingResponse.data);

				},
				function(meetingResponse){

				}));
				
			}
		} /** END for loop */


		/** LOAD CALENDAR AFTER LOADING MEETINGS INFO !!!
		    WAITS FOR ALL PROMISES FROM MEETING GET REQUESTS*/
		$q.all(vm.promiseList).then(function(waitResponse){
			
			for (var i = vm.currentGroupMeetings.length-1; i >=0; i--) {
				if (uniqueMeetingIds.indexOf(vm.currentGroupMeetings[i].id) <= -1) {
					
					uniqueMeetingIds.push(vm.currentGroupMeetings[i].id);
					
					/** Setup vm.meetings String for pickadate calendar to know what days meetings are scheduled
					pickadate modified to splice string at ',' and make a list of strings formatted like 'mm/dd/yyyy' */

					day = String(vm.currentGroupMeetings[i].start_time).substring(8,10);
					month = String(vm.currentGroupMeetings[i].start_time).substring(5,7);
					year = String(vm.currentGroupMeetings[i].start_time).substring(0,4);


					day = parseInt(day);
					month = parseInt(month);
					month -= 1;

					vm.meetings += "" + month + "/" + day + "/" + year + ",";
					
				}
				else {
					vm.currentGroupMeetings.splice(i,1);
					vm.filteredMeetings.splice(i,1);
				}
			}
		
			vm.filterMeetingsOnClick();
		
			vm.calendarHTML = '/static/templates/calendar.html';
		});

	} /** END loadGroupMeetings() */



	/**------------------------------------------*/
	/** filter meetings list for selected day    */
	/**------------------------------------------*/
	vm.filterMeetingsOnClick = function() {

		var day;
		var month;
		var year;
		var selectedDay;
		var selectedMonth;
		var selectedYear;
		
		vm.filteredMeetings = [];

		for (var i = vm.currentGroupMeetings.length-1; i >=0; i--) {

			day = String(vm.currentGroupMeetings[i].start_time).substring(8,10);
			month = String(vm.currentGroupMeetings[i].start_time).substring(5,7);
			year = String(vm.currentGroupMeetings[i].start_time).substring(0,4);
			
			if (vm.firstMeetingFiltering == false) {
				selectedDay = String(vm.date).substring(3,5);
				selectedMonth = String(vm.date).substring(0,2);
				selectedYear = String(vm.date).substring(6,10);
			}
			else {
				var tempTimeString = vm.date.toISOString();
				selectedDay = tempTimeString.substring(8,10);
				selectedMonth = tempTimeString.substring(5,7);
				selectedYear = tempTimeString.substring(0,4);
			}
			/**alert("|" + day + month + year + ":" + selectedDay + selectedMonth + selectedYear + "|");*/
			if (day == selectedDay && month == selectedMonth && year == selectedYear)
				vm.filteredMeetings.push(vm.currentGroupMeetings[i]);
		}
		vm.firstMeetingFiltering = false;
	}



	/**------------------------------------------*/
	/** Check if current user is in meeting		 
		return true or false					 */
	/**------------------------------------------*/
	vm.isUserAttendMeeting = function(meeting) {
		
		var meetingIds = [];
		/**
		for (var i = 0; i < vm.currentGroupMeetings.length; i++) {
			meetingIds.push(vm.currentGroupMeetings[i].id);
		}*/
		for (var i = 0; i < vm.msgpUserAll.length; i++) {
			if (vm.msgpUserAll[i].msgpMeetingId == meeting.id) {
				if (vm.msgpUserAll[i].msgpUserId == vm.thisUser.id)
					return true;
			}	
		}
		return false;
	}



	/**------------------------------------------*/
	/** User joins meeting, +1 to meeting 
	    attendance count					     */
	/**------------------------------------------*/
	vm.userAttendMeeting = function(meeting) {
	
		var newAttendingCount = meeting.users_attending;
		newAttendingCount += 1;

		/** Update meeting users_attending column by adding 1 */
		$http({method: 'PATCH',
			url: '/api/meeting/' + meeting.id + '/',
			data: {
				users_attending: newAttendingCount
			}
		})
		.then(function(patchResponse){
			/** success */
			vm.getGroupsData();
		},
		function(patchResponse){
			/** request failed */
		});
		
		/** add new entry to msgpUser table to associate current user with this meeting */
		$http({method: 'POST',
			url: '/api/msgpUser/',
			data: {
				msgpUserId: vm.thisUser.id,
				msgpUsername: vm.thisUser.username,
				msgpGroupId: vm.groupInfo.id,
				msgpGroupName: vm.groupInfo.groupName,
				msgpMeetingId: meeting.id
			}
		})
		.then(function(msgpUserResponse){
			/** msgpUser POST success */
	
		},
		function(msgpUserResponse){
			/**msgpUser POST failed*/
		});
		
	}
	
	
	
	/**------------------------------------------*/
	/** User no longer attending meeting, either
	    -1 to meeting attendance or delete meeting*/
	/**------------------------------------------*/
	vm.userNotAttendMeeting = function(meeting) {	
		
		/** Delete meeting if current members attending is 1 */
		if (meeting.users_attending <= 1) {
			$http({method: 'DELETE',
	  		   url: '/api/meeting/' + meeting.id + '/',
	  		})
	  		.then(function(deleteMeetingResponse){
				/** success */
				for (var i = 0; i < vm.filteredMeetings.length; i++) {
					if (vm.filteredMeetings[i].id == meeting.id)
						vm.filteredMeetings.splice(i,1);
				}
				vm.getGroupsData();
	  		},
	  		function(deleteMeetingResponse){
	  			/** request failed */
	  		});
		}
		else {

			var newAttendingCount = meeting.users_attending;
			newAttendingCount -= 1;

			/** Update meeting users_attending column by subtracting 1 */
			$http({method: 'PATCH',
				url: '/api/meeting/' + meeting.id + '/',
				data: {
					users_attending: newAttendingCount
				}
			})
			.then(function(patchResponse){
				/** success */
				vm.getGroupsData();
			},
			function(patchResponse){
				/** request failed */
			});
		}
		/** Delete msgpUser entry associated with that user and meeting */
		for (var i = vm.msgpUserAll.length-1; i >= 0; i--) {
			if (vm.msgpUserAll[i].msgpMeetingId == meeting.id) {
				if (vm.msgpUserAll[i].msgpUserId == vm.thisUser.id) {
					/** delete msgpUser table entry */
					$http({method: 'DELETE',
					   url: '/api/msgpUser/' + vm.msgpUserAll[i].id + '/',
					})
					.then(function(deleteMSGPUserResponse){
						
					},
					function(deleteMSGPUserResponse){
						/** request failed */
					});
				}
			}
		}
		
	}
	
	

	/**------------------------------------------*/
	/** Reporting POST function                  */
	/**------------------------------------------*/
  vm.reportUser = function(reporteeName)
  {
    var user = Authentication.getAuthenticatedAccount();

    $http({method: 'POST',
    url: '/api/report/',
    data: {
      reporter: vm.thisUser.username,
      reportee: reporteeName,
      comments: vm.reportFields.reportComments,
      // date_submitted: vm.reportFields.date,
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
	/** Chat GET AND POST functions              */
	/**------------------------------------------*/
  vm.getMessage = function()
  {
    $http({method: 'GET',
       url: '/api/chat/'})
       .then(function(response){
         vm.messages = response.data;
       },
       function(response){
     });

     $timeout(function(){
       vm.getMessage();
     }, 1000)
  }

  vm.getMessage();

  vm.sendMessage = function()
  {
    $http({method: 'POST',
    url: '/api/chat/',
    data: {
      message: vm.chatFields.message,
      }
    })
    .then(function(response){
      $http({method: 'GET',
         url: '/api/chat/'})
         .then(function(response){
           vm.messages = response.data;
         },
         function(response){
       });
    });
    $('#comments').val('');
  }


	/**------------------------------------------*/
	/** Meeting POST function                    */
	/**------------------------------------------*/
	vm.createMeeting = function(meetingValidation) {
		/**var startTime = $filter('date')(vm.startTime, 'H:mm');*/
		/**vm.test = $filter('date')(vm.startTime, 'MM/dd/yyyy hh:mm');*/

		if (meetingValidation[0] == true) {
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
					vm.meetingCreationStatus = meetingValidation[1];		
					
					/** Load/update all entries from the msgpUser table
						as there is a new one now*/
					vm.getGroupsData();

				},
				function(msgpUserResponse){
					/**msgpUser POST failed*/
					vm.meetingCreationStatus = "Error creating meeting!";
				});

	  		},
	  		function(meetingResponse){
	  			/** meeting POST failed */
	  			vm.meetingCreationStatus = "Error creating meeting!";
	  		});
  		}
  		else
  			vm.meetingCreationStatus = meetingValidation[1];
		
	} /** END meeting function */


	/** Functions to run on page load */
	/** ----------------------------------------------------------- */
	/** Load info on current group on page load */
	vm.getGroupInfo();
	/** Load all entries from the msgpUser table on page load */
	vm.getGroupsData();
	/** Sets defualt create meeting start/end time options */
	vm.setDefualtMeetingInfo();
	
	/** Load current groups's meetings ### CALLED IN .THEN FUNCTION OF vm.getGroupsData() ### */
	
	/** ----------------------------------------------------------- */

  }

})();
