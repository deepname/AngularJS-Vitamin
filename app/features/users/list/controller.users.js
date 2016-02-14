(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.users')
        .controller('UsersListController', UsersListController);

    UsersListController.$inject = ['$scope', 'setUser'];

    function UsersListController($scope, setUser) {

        $scope.user = setUser.users;

        $scope.bigCurrentPage = setUser.numPage;

        $scope.numOfItems = setUser.numOfItems;

        debugger;

        $scope.photos = [
            {id: 'p1', 'title': 'A nice day!', src: "http://lorempixel.com/300/400/"},
            {id: 'p2', 'title': 'Puh!', src: "http://lorempixel.com/300/400/sports"},
            {id: 'p3', 'title': 'What a club!', src: "http://lorempixel.com/300/400/nightlife"}
        ];
    }
})();
