'use strict';
var apiBase = 'http://localhost:3000/';
var apiPath = {
    login: 'user/login',
    passwordRecovery: 'user/recovery'
};

/*
 This is a helpful function that will construct us the full url to connect to our backend by giving just the key.
 We need first to define a key in API_PATH for the path in order to use.

 Ex: $http(build('login'))
 */

function buildURL(path) {
    return apiBase + apiPath[path];
}

/*
 More information: https://github.com/Narzerus/angular-permission#defining-roles

 In this function we will define all the different roles that our users can have.
 How it works?

 Permission.defineRole('NAME_FOR_ROLE', function () {
 return A_CONDITION_THAT_RETURNS_TRUE_IF_USER_BELONGS_TO_THIS_ROLE;
 }
 */

function loadPermissions(Permission, UserFactory) {
    Permission.defineRole('anonymous', function () {
        return !UserFactory.getUser();
    });

    Permission.defineRole('user', function () {
        if (angular.isDefined(UserFactory.getUser())) {
            if (UserFactory.getUser().role === 'user') {
                return true;
            }
        }
    });

    Permission.defineRole('administrator', function () {
        if (angular.isDefined(UserFactory.getUser())) {
            if (UserFactory.getUser().role === 'administrator') {
                return true;
            }
        }
    });
}

/*
 Sometimes we need to have a temporal variable accessible across the entire application but we don't mind if we loose it
 by reloading the web. For example, if we have a list with content paginated and we want to edit some articles but
 without loosing the page we were at the list, we can save it as a temporal variable and then recover it.
 To do that we should use $rootScope but injecting it in every controller/service/factory we want to recover or save it.
 This is an alike function that uses $rootScope but makes it accessible by $scope so we don't have to inject it every
 time.

 We have three small functions. Create, remove and get. How to use it?
 1- Creating a temporal variable: $scope.tmpData('add', 'variableName', 'content');
 1- Removing a temporal variable: $scope.tmpData('remove', 'variableName');
 1- Getting  a temporal variable: $scope.tmpData('get', 'variableName');

 We can storage an object, array or simply a string.
 */

function tmpData($rootScope) {
    var tmpDataObject = {};
    $rootScope.tmpData = function (method, key, value) {
        switch (method) {
            case 'add' :
                tmpDataObject[key] = value;
                break;
            case 'remove' :
                delete tmpDataObject[key];
                break;
            case 'get' :
                return tmpDataObject[key];
        }
    };
}
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin', [
            /*
             To make it easier first will inject all external dependencies to our main module
             */
            'ui.router',
            'ngAnimate',
            'ngStorage',
            'permission',
            'angular-loading-bar',
            'ngSanitize',
            'jm.i18next',
            'tmh.dynamicLocale',

            /*
             Then all our app modules
             */
            'angularJS-Vitamin.auth',
            'angularJS-Vitamin.async',
            'angularJS-Vitamin.dashboard',
            'angularJS-Vitamin.components',
            'angularJS-Vitamin.example'
        ])
        .config(appConfig)
        .run(appRun);


    appConfig.$inject = ['$locationProvider', '$i18nextProvider', 'cfpLoadingBarProvider', '$urlRouterProvider', 'tmhDynamicLocaleProvider'];
    function appConfig($locationProvider, $i18nextProvider, cfpLoadingBarProvider, $urlRouterProvider, tmhDynamicLocaleProvider) {
        /*
         In case non of all the $stateProvider states gets resolved, we want to redirect the user to specific path.
         For example /login. By it's own nature, login will redirect to /dashboard if the user is already logged.
         */
        $urlRouterProvider.otherwise(function ($invokeor) {
            var $state = $invokeor.get('$state');
            $state.transitionTo('login');
        });

        /*
         Normally people don't care about the /#/ path on their apps url but is something that every time it disturbs me
         so this is how to disable it by enabling the HTML5 mode.
         */
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        /*
         Declaration of basic functionality for i18n module
         */
        $i18nextProvider.options = {
            lng: 'en',                              // Default locale
            fallbackLng: 'en',
            useCookie: false,
            useLocalStorage: false,
            resGetPath: '/assets/locale/__lng__.json',   // Locale file with lng from above
            defaultLoadingValue: ''
        };

        /*
         With this we can disable a spin gif that shows up when the loading bar is trigger. Which I don't like
         */
        cfpLoadingBarProvider.includeSpinner = false;

        /*
         Define the path to angular's i18n. This affects to calendars and dates only.
         */
        tmhDynamicLocaleProvider.localeLocationPattern('/angular/i18n/angular-locale_{{locale}}.js');
    }

    appRun.$inject = ['$rootScope', 'tmhDynamicLocale', '$i18next'];
    function appRun($rootScope, tmhDynamicLocale, $i18next) {
        $rootScope.$on('$stateChangeSuccess', function (event, args) {
            /*
             In every state configuration from module.*.js we define inside data object a template key. This will tell
             angular which template it should render for the view. Here we make the url to use in index.html with an
             ng-include.
             */
            $rootScope.layoutTemplate = '/layouts/' + args.data.template + '.html';

            /*
             With this code we can detect if user is not anonymous and inject some Auth in every external call to a
             resource. This is useful when our backend needs a token validation for calls.
             */
            var locale = (navigator.language || navigator.userLanguage).split('-')[0];

            //
            //var reqPerms = args.data.permissions;
            //var anonymousUser = angular.isDefined(reqPerms.only) && reqPerms.only[0] === 'anonymous';
            //if (!anonymousUser) {
            //    $http.defaults.headers.common['x-auth-token'] = UserFactory.getUserToken();
            //    locale = UserFactory.getUser().locale;
            //}

            tmhDynamicLocale.set(locale);
            $i18next.options.lng = locale;
        });

        /*
         Normally we can externalize some functions to have a more friendly and readable app config file.
         In this case those two functions are created in utils.js.
         */

        /* global tmpData */
        tmpData($rootScope);
    }
}());
(function () {
    'use strict';

    angular
        .module('angularJS-Vitamin.async', [])
        .config(AsyncConfig);

    AsyncConfig.$inject = ['$stateProvider'];
    function AsyncConfig($stateProvider) {
        $stateProvider
            .state('loremIpsum', {
                url: '/lorem',
                templateUrl: '/features/async/loremIpsum/loremIpsum.tpl.html',
                controller: 'LoremIpsumController',
                data: {
                    template: 'complex',
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'login'
                    }
                },
                resolve: {
                    /*
                     More information: https://github.com/angular-ui/ui-router/wiki#resolve

                     Resolve will make the controller and view wait until all params are resolved.
                     This method is commonly used when we implement an async load and we need to wait until the resources
                     are loaded to print it into the view or use it in the controller.

                     In the case of an $http resource we will need to implement promises to make it works. To see an
                     example open the service.async.js from the Async feature.

                     The name we define will be the same to inject in our controller.
                     */
                    loremIpsum: function (AsyncFactory) {
                        return AsyncFactory.getLoremIpsum();
                    }
                }
            });
    }
}());
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth', [])
        .config(AuthConfig)
        .run(AuthRun);

    AuthConfig.$inject = ['$stateProvider'];
    function AuthConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/features/auth/login/login.tpl.html',
                controller: 'LoginController',
                data: {
                    template: 'empty',
                    permissions: {
                        only: ['anonymous'],
                        redirectTo: 'dashboard'
                    }
                }
            })
            .state('logout', {
                url: '/logout',
                controller: function ($state, UserFactory) {
                    UserFactory.doLogout();
                    $state.go('login');
                },
                data: {
                    template: 'empty',
                    permissions: {
                        except: ['anonymous'],
                        redirectTo: 'dashboard'
                    }
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: '/features/auth/signup/signup.tpl.html',
                controller: 'SignupController',
                data: {
                    template: 'empty',
                    permissions: {
                        only: ['anonymous'],
                        redirectTo: 'dashboard'
                    }
                }
            });
    }

    AuthRun.$inject = ['Permission', 'UserFactory'];
    function AuthRun(Permission, UserFactory){
        /* global loadPermissions */
        loadPermissions(Permission, UserFactory);
    }
}());
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.components', [])
        .directive('vitHeader', vitHeader)
        .directive('roleAuth', roleAuth);
    /*
     This module is that "special one" that doesn't follows the rules.
     Components is an itemset which contains only directives.

     The rule is the following one: If and only if the directive doesn't have a view and the use of the controller is
     very small we can define the hole thing in the module component.

     The directive vitHeader represents the header directive. Because it have a view we only define the basics of the
     directive on the module and externalize the view and controller in a different folder with its name.
     */

    function vitHeader() {
        return {
            restrict: 'E',
            templateUrl: '/features/components/header/header.tpl.html',
            controller: 'HeaderComponentController'
        };
    }

    /*
     roleAuth is a simple directive that, depending of the user role and an object that passes by the attribute
     role-auth, we remove or not the element from the DOM. This allows us to show or hide elements in a view depending
     of the user role. I mean, in the same template two different users can see different thing depending of the role.

     I made the syntax exactly the same as angular-permissions in order to make it easier to use. In the header view
     there's an example of how implement it.
     */
    function roleAuth(UserFactory) {
        return {
            restrict: 'A',
            scope: {
                'roleAuth': '@'
            },
            link: function compile(scope, element, attrs) {
                var authRoles = JSON.parse(attrs.roleAuth.replace(/'/g, '"'));
                var userRole = UserFactory.getUser().role;

                if (angular.isDefined(authRoles.only) && authRoles.only.indexOf(userRole) < 0) {
                    element.remove();
                }
                if (angular.isDefined(authRoles.except) && authRoles.except.indexOf(userRole) >= 0) {
                    element.remove();
                }
            }
        };
    }
}());
/*
 We want our functions to be private and only accessible for this module to use it.
 */
(function () {
    /*
     Force the strict mode: http://www.w3schools.com/js/js_strict.asp
     */
    'use strict';
    angular
        .module('angularJS-Vitamin.dashboard', [])
        .config(DashboardConfig);
    /*
     With the empty array of dependencies (it could not be empty) we declare the module so now we can start adding
     different things to it as a config, controllers, directives or services/factories.

     Every time we add pieces to our module we will use this nomenclature:

     .config(PascalCaseToFunction)
     .run('PascalCaseRunFunction', PascalCaseRunFunction)

     PascalCaseToFunction.$inject = ['$SomeProvider'];
     function PascalCaseToFunction($SomeProvider){ ... }

     PascalCaseRunFunction.$inject = ['$SomeModuleConfiguration'];
     function PascalCaseRunFunction($SomeModuleConfiguration){ ... }

     IMPORTANT
     ---------
     The main idea is that in the module declaration we only implement the $stateProvider with ONLY the module
     state routes.
     In some cases we can add the .run function if needed.

     */

    DashboardConfig.$inject = ['$stateProvider'];
    function DashboardConfig($stateProvider) {
        $stateProvider
        /*
         Declaration of state routes for this module (only features from this one)
         */
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '/features/dashboard/home/home.tpl.html',
                controller: 'HomeController',
                data: {
                    template: 'complex',        // Template name without extension from /layouts folder
                    permissions: {
                        /*
                         More information: https://github.com/Narzerus/angular-permission

                         Main basics of configuration at this point.
                         We have two different options: only and except. We provide an array of roles that are or not
                         able to enter in this route. In the opposite case, they will be redirect to redirectTo state.

                         Examples:
                         1- If we want only non registered users to enter we say -> only : ['anonymous']
                         2- If we want only registered users to enter we say -> except : ['anonymous']

                         */
                        except: ['anonymous'],
                        redirectTo: 'login'
                    }
                },
                resolve: {
                    /*
                     More information: https://github.com/angular-ui/ui-router/wiki#resolve

                     Resolve will make the controller and view wait until all params are resolved.
                     This method is commonly used when we implement an async load and we need to wait until the resources
                     are loaded to print it into the view or use it in the controller.

                     In the case of an $http resource we will need to implement promises to make it works. To see an
                     example open the service.async.js from the Async feature.
                     */
                    userInfo: function (UserFactory) {
                        return UserFactory.getUser();
                    }
                }
            });
    }
}());

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
                }
            }
        });
    }
})();

(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.async')
        .factory('AsyncFactory', AsyncFactory);


    AsyncFactory.$inject = ['$http'];
    function AsyncFactory($http) {
        return {
            getLoremIpsum: function () {
                return $http
                    .get('https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1')
                    .then(function (response) {
                        /*
                         In this case we are calling an external service. Using the function .then we can return
                         the response information to the controller or resolve that requested it.

                         .then has two functions. The first one is for a success response, the second one is for
                         a error catch.
                         */
                        return response.data;
                    });
            }
        };
    }

}());
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth')
        .factory('UserFactory', UserFactory);

    UserFactory.$inject = ['$q', '$localStorage'];
    function UserFactory($q, $localStorage) {
        return {
            getUser: function () {
                return $localStorage.User;
            },
            getUserToken: function () {
                return $localStorage.User.token;
            },
            doLogout: function () {
                delete $localStorage.User;
            },
            doLogin: function (credentials) {
                var dfd = $q.defer();

                //$http
                //    .post(buildURL('login'), credentials)
                //    .then(function (response) {
                //        if(!response.data.error){
                //            $localStorage.User = response.data.user;
                //            dfd.resolve(true);
                //        }else{
                //            dfd.reject(response);
                //        }
                //    }, function (err) {
                //        dfd.reject(err);
                //    });

                // FAKE DATA TO SIMULATE A LOGIN
                var userInfo = null;
                switch (credentials.username + ':' + credentials.password) {
                    case 'demo@demo.com:demo':
                        userInfo = {name: 'demo', role: 'user'};
                        break;
                    case 'admin@admin.com:admin':
                        userInfo = {name: 'admin', role: 'administrator'};
                        break;
                    case 'moderator@moderator.com:moderator':
                        userInfo = {name: 'moderator', role: 'moderator'};
                        break;
                    default :
                        dfd.reject(true);
                        break;
                }

                userInfo.locale = 'en';
                userInfo.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
                $localStorage.User = userInfo;
                dfd.resolve(true);

                // END FAKE LOGIN

                return dfd.promise;
            },
            doSignup: function (credentials) {
                var dfd = $q.defer();

                //$http
                //    .post(buildURL('login'), credentials)
                //    .then(function (response) {
                //        if(!response.data.error){
                //            dfd.resolve(response.data.user);
                //        }else{
                //            dfd.reject(response);
                //        }
                //    }, function (err) {
                //        dfd.reject(err);
                //    });


                // FAKE SIGNUP

                var existingUsers = ['demo@demo.com', 'admin@admin.com', 'manager@manager.com'];

                if (existingUsers.indexOf(credentials.email) < 0) {
                    dfd.resolve(true);
                } else {
                    dfd.resolve({success: false, msg: 'email_already_taken'});
                }

                // END FAKE SIGNUP

                return dfd.promise;
            }
        };
    }
}());
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.async')
        .controller('LoremIpsumController', LoremIpsumController);

    LoremIpsumController.$inject = ['$scope', 'loremIpsum'];
    function LoremIpsumController($scope, loremIpsum) {
        /*
         Because we defined in the resolve loremImpsum as key for the promise result, we can just inject it on our
         controller to get the information we pass by resolving it.

         In this case loremIpsum is an array so we pick up the first slot of it.
         */
        $scope.loremIpsum = loremIpsum[0];
    }
}());
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'UserFactory', '$state'];
    function LoginController($scope, UserFactory, $state) {
        $scope.loginForm = {
            username: null,
            password: null
        };

        $scope.login = function () {
            $scope.loginForm.error = false;
            UserFactory.doLogin($scope.loginForm)
                .then(function () {
                    $state.go('dashboard');
                }, function (err) {
                    $scope.loginForm.error = err;
                });
        };
    }
}());

(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.auth')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['$scope', 'UserFactory', '$state'];
    function SignupController($scope, UserFactory, $state) {
        $scope.signupForm = {
            email: null,
            password: null,
            password2: null
        };

        $scope.signup = function () {
            $scope.signupForm.error = false;
            UserFactory.doLogin($scope.loginForm)
                .then(function (response) {
                    if (response.success) {
                        $state.go('dashboard');
                    } else {
                        $scope.loginForm.errorEmail = response;
                    }
                }, function (err) {
                    $scope.loginForm.error = err;
                });
        };
    }
}());
(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.components')
        .controller('HeaderComponentController', HeaderComponentController);

    HeaderComponentController.$inject = ['$scope'];
    function HeaderComponentController($scope) {

    }
}());

(function () {
    'use strict';
    angular
        .module('angularJS-Vitamin.dashboard')
        .controller('HomeController', HomeController);
    /*
     Because of how we defined Gulp inject JS files, all modules.*.js files were injected in the very top of the app.js
     in assets/js/app.js file. This allows us to append controllers, services/factories or directives to an existing
     module.

     That why we don't use the empty array in the module declaration. In this case we say that we are going to append
     a controller called HomeController to the dashboard module.

     Using PascalCase we define the name of the controller and the function associate as well.

     As a second param out function is getting 'userInfo' which is defined in the resolve from dashboard state in the
     module.dashboard.js
     */

    HomeController.$inject = ['$scope', 'userInfo', '$filter'];
    function HomeController($scope, userInfo, $filter) {
        $scope.user = userInfo;
        $scope.html = '<br>demo<br>';
        var demo = $filter('i18next')('auth...');
    }
}());
(function() {
    'use strict';
    angular
        .module('angularJS-Vitamin.example')
        .controller('ExampleController', ExampleController);

    ExampleController.$inject = ['$scope', 'example'];

    function ExampleController($scope, example) {


        $scope.example = example;
    }



})();
