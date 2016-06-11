app.factory('notifyService', 
['$timeout', 'lodash', ($timeout, _) => {
  class notify {
    constructor () {
      this.notifies = [];
    }

    add (type, text, timer) {
      let notify = {text: text, type: type, timer: timer};
      this.notifies.push(notify);
      if (timer) {
        $timeout(() => {this.remove(notify)}, timer);
      }
    }

    remove (notify) {
      _.remove(this.notifies, function(elem) {return elem === notify});
    }
  }

  return new notify();
}
]);