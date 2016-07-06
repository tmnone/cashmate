app.factory('TransactionMapper', 
['$rootScope', 'TransactionEntity', 
($rootScope, TransactionEntity) =>
  class TransactionMapper {
    static load (transaction) {
      return new TransactionEntity(transaction);
    }
    static normalize (transaction) {
      return JSON.stringify({ 
        objectId:  transaction.objectId,
        label_ids: transaction.label_ids,
        labels:    transaction.labels.concat(),
        owner:  {
          __type: "Pointer", 
          className: "_User", 
          objectId: $rootScope.currentUser.userId
        },
        date:      {
          "__type": "Date",
          "iso": transaction.date || new Date()
        },
        value:     +transaction.value,
        note:      transaction.note
      })
    }
  }
]);