app.factory('TransactionEntity', () => 
  class TransactionEntity {
    constructor (attr = {}) {
      this.objectId = attr.objectId;
      this.label_ids = attr.label_ids;
      this.labels = attr.labels;
      this.user_id = attr.user_id;
      this.date = attr.date;
      this.value = attr.value;
      this.note = attr.note;
    }
  }
);