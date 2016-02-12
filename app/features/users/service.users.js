(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.users')
        .factory('RemoteUsersFactory', RemoteUsersFactory);

    RemoteUsersFactory.$inject = ['$http', '$q'];
    function RemoteUsersFactory($http, $q) {
        return {
            getUsers: function (numPag, total) {
                var dfd = $q.defer();
                $http
                    .get('http://jsonplaceholder.typicode.com/photos')
                    .then(function (response) {

                        numPag = numPag !== '' ? parseInt(numPag) : 0;
                        var numOfItems = total || 10;
                        var listItems = [];

                        for (var i = numPag*10; i < numPag * 10 + numOfItems; i++) {
                            console.log('a');
                            listItems.push(response.data[i]);
                        }

                        dfd.resolve(listItems);
                    });

                return dfd.promise;
            }
        };
    }
})();