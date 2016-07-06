app.factory('transactionRepository', 
['$rootScope', 'transactionResource', 'TransactionMapper', 'userMapper',
($rootScope, resourse, TransactionMapper, userMapper) =>
  class transactionRepository {

    static readPage (skip, limit) {
      let params = {
        "skip": skip, 
        "limit": limit,
        "where": {"owner":{"__type": "Pointer", "className": "_User", "objectId": $rootScope.currentUser.userId}}
      };
      return resourse.readPage(params).$promise.then((res) => {
        res.results = res.results.map(TransactionMapper.load);
        return res;
      });
    }

    static readAll () {
      let where = {"owner": {"__type": "Pointer", "className": "_User", "objectId": $rootScope.currentUser.userId}};
      return resourse.readAll({where}).$promise.then((res) => {
        res.results = res.results.map(TransactionMapper.load);
        return res;
      });
    }

    static read (id) {
      let where = {"objectId": id};
      return resourse.read({where}).$promise.then((res) => {
        res.results = res.results.map(TransactionMapper.load);
        return res;
      });
    }

    static addTransaction (transaction) {
      return resourse.addTransaction(TransactionMapper.normalize(transaction)).$promise
    }

    static updateTransactionNote (transaction) {
      let params = {"objectId": transaction.objectId};
      let data   = {"note": transaction.note};
      return resourse.updateTransaction(params, data).$promise
    }

    static updateTransactionValue (transaction) {
      let params = {"objectId": transaction.objectId};
      let data   = {"value": +transaction.value};
      return resourse.updateTransaction(params, data).$promise
    }

    static updateTransactionLabel (transaction) {
      let params = {"objectId": transaction.objectId};
      let data   = {"labels": transaction.labels};
      return resourse.updateTransaction(params, data).$promise
    }

    static updateTransaction (transaction) {
      let params = {"objectId": transaction.objectId};
      return resourse.updateTransaction(params, TransactionMapper.normalize(transaction)).$promise
    }
  }
]);