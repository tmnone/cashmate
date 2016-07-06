app.factory('TransactionEntity', () => 
  class TransactionEntity {
    constructor (attr = {}) {
      this.objectId = attr.objectId;
      this.label_ids = attr.label_ids;
      this.labels = attr.labels;
      this.owner = attr.owner;
      this.date = attr.date;
      this.value = attr.value;
      this.note = attr.note;
    }
  }
);