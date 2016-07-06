app.directive('siteHeader', 
['$rootScope', '$templateCache', '$location', 'authService', 'notifyService',
($rootScope, $templateCache, $location, authService, notify) => {
  return {
    restrict: 'E',
    // scope: {},
    template: $templateCache.get("site-header.html"),
    link: function(scope, element, attrs) {

      $rootScope.$watch("currentUser", function() {
        scope.user = $rootScope.currentUser
      });

      scope.userSignOut = function() {
        authService.logout().then((res) => {
          notify.add('info', 'You`ve Signed Out!', 5000);
          $location.path('/signin')
        });
      }
    }
  }
}]);