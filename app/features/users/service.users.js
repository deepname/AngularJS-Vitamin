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

                        numPag = numPag !== '' ? parseInt(numPag) : 0;
                        var numOfItems = total || 10;
                        var listItems = {
                            users : [],
                            numPage:0,
                            numOfItems: 0
                        };

                        for (var i = numPag*10; i < numPag * 10 + numOfItems; i++) {
                            listItems.users.push(response.data[i]);
                        }
                        listItems.numPage = numPag;
                        listItems.numOfItems = numOfItems;
                        dfd.resolve(listItems);
                    });

                return dfd.promise;
            }
        };
    }
})();