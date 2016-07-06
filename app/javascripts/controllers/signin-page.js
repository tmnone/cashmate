app.controller('SigninPageController', 
['$location', '$rootScope', '$scope', 'authService', 'notifyService', 
($location, $rootScope, $scope, authService, notify) => {

  $scope.user = {}
  
  $scope.userSignIn = function() {

    authService.login($scope.user)
      .then((res) => {
        // console.log('LOGIN USER', res);
        return authService.getSessionId($rootScope.currentUser.sessionToken)
      })
      .then((session) => {
        notify.add('success', 'Successfully SignIn!', 5000);
        $location.path('/');
      });
  }

}]);