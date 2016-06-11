app.factory('transactionRepository', 
['transactionResource', 'TransactionMapper', (resourse, TransactionMapper) =>
  class transactionRepository {

    static readAll () {
      return resourse.readAll().$promise.then((res) => {
        res.results = res.results.map(TransactionMapper.load);
        return res;
      });
    }

    static read (id) {
      function filterById(elem) { return elem.objectId == id }
      let param = {'readId':`where={"objectId":"${id}"}`};
      return resourse.read(param).$promise.then((res) => {
        res.results = res.results.map(TransactionMapper.load);
        return res;
      });
    }

    static addTransaction (transaction) {
      console.log('add', TransactionMapper.normalize(transaction));
      return resourse.addTransaction(TransactionMapper.normalize(transaction)).$promise
    }

    static updateTransactionNote (transaction) {
      let params = {'objectId': transaction.objectId};
      let data   = {'note': transaction.note};
      return resourse.updateTransaction(params, data).$promise
    }

    static updateTransactionValue (transaction) {
      let params = {'objectId': transaction.objectId};
      let data   = {'value': +transaction.value};
      return resourse.updateTransaction(params, data).$promise
    }

    static updateTransactionLabel (transaction) {
      let params = {'objectId': transaction.objectId};
      let data   = {'labels': transaction.labels};
      return resourse.updateTransaction(params, data).$promise
    }

    static updateTransaction (transaction) {
      let params = {'objectId': transaction.objectId};
      return resourse.updateTransaction(params, TransactionMapper.normalize(transaction)).$promise
    }
  }
]);