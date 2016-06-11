app.config([
  '$routeProvider', '$locationProvider', 'localStorageServiceProvider', function($routeProvider, $locationProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/transaction/new', {
        templateUrl: '../pages/transaction-new.html',
        controller: 'TransactionNewPageController'
      }).when('/transaction/edit/:id', {
        templateUrl: '../pages/transaction-edit.html',
        controller: 'TransactionEditPageController'
      }).otherwise({
        redirectTo: '/',
        templateUrl: '../pages/index.html',
        controller: 'IndexPageController'
      });
    $locationProvider.html5Mode();
    localStorageServiceProvider.setPrefix('cashmateApp');
  }
]);

app.config(
  ['$httpProvider',
    function ($httpProvider) {
      $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '60w8hWaSMAJRkQkPEQEnz4mDnK64TDibBaYMPH1u';
      $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SvFh7Tz0yQP5fadnL2Imknux9runUdnEU5uGGC5j';
      $httpProvider.defaults.headers.common['X-Parse-Session-Token'] = 'r:aeede07f8ccf7e535a864e0d20acbeda';
    }
  ]
)