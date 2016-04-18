(function(){
    'use strict';
    
    angular
	.module('myStudyGroupPlanner')
	.controller('DeleteDataController', DeleteDataController);
    
    DeleteDataController.$inject = ['$location', '$scope', 'Authentication'];
    
    /**
     * @namespace DeleteDataController
     */
    function DeleteDataController($location, $scope, Authentication) {
	var vm = this;
    }   
})();
