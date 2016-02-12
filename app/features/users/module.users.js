(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.users', [])
        .config(UsersConfig);

    UsersConfig.$inject = ['$stateProvider'];

    function UsersConfig($stateProvider) {
        $stateProvider
            .state('userList', {
                url: '/usersList/:page',
                templateUrl: '/features/users/list/users.tpl.html',
                controller: 'UsersListController',
                data: {
                    template: 'complex',
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'login'
                    }
                },
                resolve: {
                    setUser: function (RemoteUsersFactory, $stateParams) {
                        return RemoteUsersFactory.getUsers($stateParams.page, 10);
                    }
                }
            });
    }
})();
