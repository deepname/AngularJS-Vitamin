(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.posts')
        .factory('RemotePostsFactory', RemotePostsFactory);

    RemotePostsFactory.$inject = ['$http', '$q'];
    function RemotePostsFactory($http, $q) {
        return {
            getPost: function (numPag, total) {
                var dfd = $q.defer();
                $http
                    .get('http://jsonplaceholder.typicode.com/posts')
                    .then(function (response) {
                        var listItems = {
                            posts : [],
                            numPag: numPag !== '' ? parseInt(numPag) : 0,
                            numOfItems: total || 10
                        };
                        for (var i = listItems.numPag*10; i < listItems.numPag * 10 + listItems.numOfItems; i++) {
                            listItems.posts.push(response.data[i]);
                        }
                        dfd.resolve(listItems);
                    });
                return dfd.promise;
            }
        };
    }
})();