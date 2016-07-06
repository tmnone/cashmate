app.factory('userResource', [ '$resource', ($resource) => {
  return $resource(API_HOST, { },
    {
      create: {
        method: 'POST',
        url: API_HOST + '/_User'
      },

      getUserById: {
        method: 'GET',
        url: API_HOST + '/_User/:userId'
      },

      getUserBySessionId: {
        method: 'GET',
        url: API_HOST + '/_Session/:sessionId'
      },

      login: {
        method: 'GET',
        url: 'https://parseapi.back4app.com/login'
      },

      logout: {
        method: 'POST',
        url: 'https://parseapi.back4app.com/logout'
      },

      getSession: {
        method: 'GET',
        url: API_HOST + '/_Session',
        params: {
          where: '@where'
        }
      }
    }
  );
}]);