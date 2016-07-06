app.run(
  ['$http', '$route', '$rootScope', '$location', 'authService',
    function ($http, $route, $rootScope, $location, authService) {
      $rootScope.$on('$routeChangeStart', function(e) {
        if(!authService.sessionId()) {
          $location.path('/signin');
        }
      });
    }
  ]
)