(function () {
  'use strict';

  angular
    .module('myStudyGroupPlanner.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/login', {
  controller: 'LoginController',
  controllerAs: 'vm',
  templateUrl: '/static/templates/authentication/login.html'
}).when('/home', {
      controller: 'HomeController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/home.html'
    }).when('/groupMember',{
      controller: 'GroupMemberController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/groupMember.html'
    }).when('/modal',{
      controller: "modalController",
      controllerAs:"vm",
      templateUrl:'/static/templates/modal.html'
    }).when('/adminHome', {
      controller: 'AdminHomeController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/admin/adminHome.html'
    }).when('/groupCreator', {
      controller: 'GroupCreatorController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/groupCreator.html'
    }).when('/deleteData', {
	controller: 'DeleteDataController',
	controllerAs: 'vm',
	templateUrl: '/static/templates/admin/deleteData.html'
    }).otherwise('/home');
  }
})();
