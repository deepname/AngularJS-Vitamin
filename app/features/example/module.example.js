(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.example', [])
        .config(Example);

    Example.$inject = ['$stateProvider'];

    function Example($stateProvider) {
        $stateProvider.state('p1', {
            url: '/p1',
            templateUrl: '/features/example/example/example.tpl.html',
            controller: 'ExampleController',
            data: {
                template: 'complex',
                permissions: {
                    except: ['anonymous'],
                    redirectTo: 'login'
                }
            },
            resolve: {
                example: function() {
                    return 'lolas';
                },
                sayLola : function(ExampleFactory){
                    return ExampleFactory.diLola();
                }
            }
        });
    }
})();
