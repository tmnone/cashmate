app.factory('transactionResource', [ '$resource', ($resource) => {
  return $resource(API_HOST + '/Transaction/:objectId', { 'objectId': '@objectId' },
    {
      readPage: {
        method: 'GET',
        params: {
          where: '@where',
          skip: '@skip',
          limit: '@limit',
          count: 1
        }
      },

      read: {
        method: 'GET',
        params: {
          where: '@where'
        }
      },

      readAll: {
        method: 'GET',
        params: {
          where: '@where'
        }
      },

      addTransaction: {
        method: 'POST'
      },
      
      updateTransaction: {
        method: 'PUT'
      }
    }
  );
}]);