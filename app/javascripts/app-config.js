app.config([
  '$routeProvider', '$locationProvider', 'localStorageServiceProvider', function($routeProvider, $locationProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/signin', {
        templateUrl: '../pages/signin.html',
        controller: 'SigninPageController'
      })
      .when('/transaction/new', {
        templateUrl: '../pages/transaction-new.html',
        controller: 'TransactionNewPageController',
        resolve: {
          currentUser: 'currentUserService'
        }
      }).when('/transaction/edit/:id', {
        templateUrl: '../pages/transaction-edit.html',
        controller: 'TransactionEditPageController',
        resolve: {
          currentUser: 'currentUserService'
        }
      }).otherwise({
        redirectTo: '/',
        templateUrl: '../pages/index.html',
        controller: 'IndexPageController',
        resolve: {
          currentUser: 'currentUserService'
        }
      });
    $locationProvider.html5Mode();
    localStorageServiceProvider.setPrefix('cashmateApp');
  }
]);

app.config(
  ['$httpProvider',
    function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
      $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '60w8hWaSMAJRkQkPEQEnz4mDnK64TDibBaYMPH1u';
      $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SvFh7Tz0yQP5fadnL2Imknux9runUdnEU5uGGC5j';
    }
  ]
)