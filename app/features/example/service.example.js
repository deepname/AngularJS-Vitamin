(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth')
        .factory('ExampleFactory', ExampleFactory);

    ExampleFactory.$inject = ['$q', '$localStorage', '$http'];
    function ExampleFactory($q, $localStorage, $http) {
        var users;
        return {
            diLola : function(){
                return $http
                    .get('http://jsonplaceholder.typicode.com/users');
                         
            }
        };
    }

})();
