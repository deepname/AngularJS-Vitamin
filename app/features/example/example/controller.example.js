(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.example')
        .controller('ExampleController', ExampleController);

    ExampleController.$inject = ['$scope', 'example', 'sayLola'];

    function ExampleController($scope, example, sayLola) {

debugger
        $scope.example = example;
    }



})();
