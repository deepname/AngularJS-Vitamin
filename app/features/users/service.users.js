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
                    .get('http://jsonplaceholder.typicode.com/users')
                    .then(function (response) {
                        var listItems = {
                            users : [],
                            numPag: numPag !== '' ? parseInt(numPag) : 0,
                            numOfItems: total || 10
                        };
                        for (var i = listItems.numPag*10; i < listItems.numPag * 10 + listItems.numOfItems; i++) {
                            listItems.users.push(response.data[i]);
                        }
                        dfd.resolve(listItems);
                    });
                return dfd.promise;
            }
        };
    }
})();