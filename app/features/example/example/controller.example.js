(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.example')
        .controller('ExampleController', ExampleController);

    ExampleController.$inject = ['$scope', 'example'];

    function ExampleController($scope, example) {


        $scope.example = example;
    }



})();
