app.factory('currentUserService', 
['$route', '$rootScope', '$location', 'authService',
($route, $rootScope, $location, authService) => {
  let sessionId = authService.sessionId();
  if(sessionId && !$rootScope.currentUser) {
    return authService.getUserBySessionId(sessionId).then((user) => {
      $rootScope.currentUser = user;
      return user;
    });
  } else {
    return null;
  }
}
]);