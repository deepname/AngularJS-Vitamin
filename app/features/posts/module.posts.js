(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.posts', [])
        .config(PostsConfig);

    PostsConfig.$inject = ['$stateProvider'];

    function PostsConfig($stateProvider) {
        $stateProvider
            .state('postsList', {
                url: '/postsList/:page',
                templateUrl: '/features/posts/list/posts.tpl.html',
                controller: 'PostsListController',
                data: {
                    template: 'complex',
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'login'
                    }
                },
                resolve: {
                    setPost: function (RemotePostsFactory, $stateParams) {
                        return RemotePostsFactory.getPost($stateParams.page, 10);
                    }
                }
            });
    }
})();
