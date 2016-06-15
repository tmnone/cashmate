app.factory('transactionResource', [ '$resource', ($resource) => {
  return $resource(API_HOST + '/Transaction/:objectId', { 'objectId': '@objectId' },
    {
      readPage: {
        method: 'GET',
        url: API_HOST + '/Transaction?skip=:skip&limit=:limit&count=1'
      },

      read: {
        method: 'GET',
        url: API_HOST + '/Transaction/?:readId'
      },

      readAll: {
        method: 'GET'
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