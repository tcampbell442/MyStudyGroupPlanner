/**
* GroupMemberController controller
* @namespace myStudyGroupPlanner.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner')
    .controller('GroupMemberController', GroupMemberController);

  GroupMemberController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace
  */
  function GroupMemberController($location, $scope, Authentication) {
    var vm = this;

    vm.groupName = "GroupName1";

    vm.members = ["Siqi Lin", "Tyler Campbell", "Sean Murren", "Aparna Kaliappan"];
  }

})();
