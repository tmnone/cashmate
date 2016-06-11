app.factory('TransactionMapper', 
['TransactionEntity', (TransactionEntity) =>
  class TransactionMapper {
    static load (transaction) {
      return new TransactionEntity(transaction);
    }
    static normalize (transaction) {
      return JSON.stringify({ 
        objectId:  transaction.objectId,
        label_ids: transaction.label_ids,
        labels:    transaction.labels.concat(),
        user_id:   transaction.user_id,
        // user:  {'objectId': 'BUPBw1HEox'},
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