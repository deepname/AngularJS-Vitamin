(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.users')
        .controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$scope', 'setUser'];

    function UsersListController($scope, setUser) {
        $scope.users = setUser.users;
        $scope.bigCurrentPage = setUser.numPag;
        $scope.numOfItems = setUser.numOfItems;
        $scope.bigTotalItems = setUser.users.length;
    }
})();
