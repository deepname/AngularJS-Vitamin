(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.users')
        .controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$scope', 'setUser'];

    function UsersListController($scope, setUser) {

        $scope.user = setUser;
    }



})();
