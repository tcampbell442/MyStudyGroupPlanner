/**
* Home controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('thinkster')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace HomeController
  */
  function HomeController($location, $scope, Authentication) {
    var vm = this;

    vm.GroupName = "GroupName1";
    vm.GroupMembers = "Sean Murren", "Siqi Lin", "Tyler Campbell", "Aparna Kaliappan", "Ying Zhang"];

})