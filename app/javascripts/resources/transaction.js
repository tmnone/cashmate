app.factory('transactionResource', [ '$resource', ($resource) => {
  return $resource(API_HOST + '/Transaction/:objectId?:readId', { 'objectId': '@objectId' },
    {
      read: {
        method: 'GET'
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