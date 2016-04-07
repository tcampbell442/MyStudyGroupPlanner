(function(){
    'use strict';

    angular
	.module('myStudyGroupPlanner')
	.controller('modalController', modalController);

    modalController.$inject = ['$location', '$scope', 'Authentication'];

    /**
     * @namespace modalController
     */
    function modalController($location, $scope, Authentication) {
	     var vm = this;
     }
})();
