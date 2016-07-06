app.factory('httpInterceptor', ['$injector', ($injector) => {
  return {
    request: function(config) {
      $injector.invoke(['authService', function(authService){
        if (authService.sessionToken()) {
          config.headers['X-Parse-Session-Token'] = authService.sessionToken();
        }
      }])
      return config;
    }
  }
}]);