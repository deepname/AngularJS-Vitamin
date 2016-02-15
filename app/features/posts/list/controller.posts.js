(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.posts')
        .controller('PostsListController', PostsListController);

    PostsListController.$inject = ['$scope', 'setPost'];

    function PostsListController($scope, setPost) {
        $scope.posts = setPost.posts;
        $scope.bigCurrentPage = setPost.numPag;
        $scope.numOfItems = setPost.numOfItems;
        $scope.bigTotalItems = setPost.posts.length;
        debugger;
        $scope.tableParams = new NgTableParams({}, { dataset: $scope.posts });
    }
})();
