(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.example')
        .factory('ExampleFactory', ExampleFactory);

    ExampleFactory.$inject = ['$http'];

    function ExampleFactory($http) {
        return {
            lola: 'lola'
        };
    }

})();
