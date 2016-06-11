'use strict';

var app = angular.module('cashmateApp', ['ngRoute', 'ngResource', 'ngLodash', 'templatescache', 'LocalStorageModule']);
'use strict';

app.config(['$routeProvider', '$locationProvider', 'localStorageServiceProvider', function ($routeProvider, $locationProvider, localStorageServiceProvider) {
  $routeProvider.when('/transaction/new', {
    templateUrl: '../pages/transaction-new.html',
    controller: 'TransactionNewPageController'
  }).when('/transaction/edit/:id', {
    templateUrl: '../pages/transaction-edit.html',
    controller: 'TransactionEditPageController'
  }).otherwise({
    redirectTo: '/',
    templateUrl: '../pages/index.html',
    controller: 'IndexPageController'
  });
  $locationProvider.html5Mode();
  localStorageServiceProvider.setPrefix('cashmateApp');
}]);

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '60w8hWaSMAJRkQkPEQEnz4mDnK64TDibBaYMPH1u';
  $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SvFh7Tz0yQP5fadnL2Imknux9runUdnEU5uGGC5j';
  $httpProvider.defaults.headers.common['X-Parse-Session-Token'] = 'r:aeede07f8ccf7e535a864e0d20acbeda';
}]);
'use strict';

// let API_HOST = 'http://localhost:9000/api';
var API_HOST = 'https://parseapi.back4app.com/classes';
// let IP_ID = '60w8hWaSMAJRkQkPEQEnz4mDnK64TDibBaYMPH1u';
'use strict';

app.controller('IndexPageController', ['$scope', 'transactionRepository', 'notifyService', function ($scope, transactionRepository, notify) {
  $scope.transactions = [];
  transactionRepository.readAll().then(function (res) {
    $scope.transactions = res.results;
  });

  $scope.updateLabel = function (transaction, editData) {
    transaction.labels = editData;
    transactionRepository.updateTransactionLabel(transaction).then(function (res) {
      notify.add('success', 'Transaction LABELS successfully updated!', 2500);
    });
  };

  $scope.updateValue = function (transaction, editData) {
    transaction.value = editData;
    transactionRepository.updateTransactionValue(transaction).then(function (res) {
      notify.add('success', 'Transaction VALUE successfully updated!', 2500);
    });
  };

  $scope.updateNote = function (transaction, editData) {
    transaction.note = editData;
    transactionRepository.updateTransactionNote(transaction).then(function (res) {
      notify.add('success', 'Transaction NOTE successfully updated!', 2500);
    });
  };
}]);
'use strict';

app.controller('TransactionEditPageController', ['$scope', '$routeParams', 'transactionRepository', 'TransactionMapper', 'notifyService', function ($scope, $routeParams, transactionRepository, TransactionMapper, notify) {

  transactionRepository.read($routeParams.id).then(function (res) {
    $scope.transaction = res.results[0];
    $scope.copyData();
  });

  $scope.copyData = function () {
    $scope.editable = TransactionMapper.load({
      objectId: $scope.transaction.objectId,
      value: $scope.transaction.value,
      labels: $scope.transaction.labels,
      note: $scope.transaction.note
    });
  };

  $scope.updateTransaction = function () {

    transactionRepository.updateTransaction($scope.editable).then(function (res) {
      notify.add('success', 'Transaction successfully updated!', 5000);
    });
  };

  $scope.reset = function () {
    $scope.copyData();
  };
}]);
'use strict';

app.controller('TransactionNewPageController', ['$scope', 'transactionRepository', 'TransactionMapper', 'notifyService', function ($scope, transactionRepository, TransactionMapper, notify) {

  $scope.newTransaction = TransactionMapper.load();

  $scope.addTransaction = function () {
    $scope.newTransaction.date = new Date();
    transactionRepository.addTransaction($scope.newTransaction).then(function (res) {
      notify.add('success', 'New transaction successfully added!', 5000);
      $scope.newTransaction = TransactionMapper.load();
    }, function (reason) {
      notify.add('danger', reason.data.error);
    });
  };
}]);
'use strict';

app.directive('editPanel', ['$templateCache', function ($templateCache) {
  return {
    restrict: 'E',
    scope: {
      editData: '=',
      onSave: '&'
    },
    template: $templateCache.get("edit-panel.html"),
    link: function link(scope, element, attrs) {
      scope.isArray = attrs.array;

      scope.toggle = function () {
        element.toggleClass('edit-panel--opened');
      };

      scope.save = function () {
        scope.onSave({ 'editData': scope.editData });
      };
    }
  };
}]);
'use strict';

app.directive('notify', ['$templateCache', 'notifyService', function ($templateCache, notify) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: $templateCache.get("notify.html"),
    link: function link(scope, element, attrs) {
      scope.notifies = notify.notifies;

      scope.removeNotify = function (msg) {
        notify.remove(msg);
      };
    }
  };
}]);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('TransactionEntity', function () {
  return function TransactionEntity() {
    var attr = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, TransactionEntity);

    this.objectId = attr.objectId;
    this.label_ids = attr.label_ids;
    this.labels = attr.labels;
    this.user_id = attr.user_id;
    this.date = attr.date;
    this.value = attr.value;
    this.note = attr.note;
  };
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('TransactionMapper', ['TransactionEntity', function (TransactionEntity) {
  return function () {
    function TransactionMapper() {
      _classCallCheck(this, TransactionMapper);
    }

    _createClass(TransactionMapper, null, [{
      key: 'load',
      value: function load(transaction) {
        return new TransactionEntity(transaction);
      }
    }, {
      key: 'normalize',
      value: function normalize(transaction) {
        return JSON.stringify({
          objectId: transaction.objectId,
          label_ids: transaction.label_ids,
          labels: transaction.labels.concat(),
          user_id: transaction.user_id,
          // user:  {'objectId': 'BUPBw1HEox'},
          date: {
            "__type": "Date",
            "iso": transaction.date || new Date()
          },
          value: +transaction.value,
          note: transaction.note
        });
      }
    }]);

    return TransactionMapper;
  }();
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('transactionRepository', ['transactionResource', 'TransactionMapper', function (resourse, TransactionMapper) {
  return function () {
    function transactionRepository() {
      _classCallCheck(this, transactionRepository);
    }

    _createClass(transactionRepository, null, [{
      key: 'readAll',
      value: function readAll() {
        return resourse.readAll().$promise.then(function (res) {
          res.results = res.results.map(TransactionMapper.load);
          return res;
        });
      }
    }, {
      key: 'read',
      value: function read(id) {
        function filterById(elem) {
          return elem.objectId == id;
        }
        var param = { 'readId': 'where={"objectId":"' + id + '"}' };
        return resourse.read(param).$promise.then(function (res) {
          res.results = res.results.map(TransactionMapper.load);
          return res;
        });
      }
    }, {
      key: 'addTransaction',
      value: function addTransaction(transaction) {
        console.log('add', TransactionMapper.normalize(transaction));
        return resourse.addTransaction(TransactionMapper.normalize(transaction)).$promise;
      }
    }, {
      key: 'updateTransactionNote',
      value: function updateTransactionNote(transaction) {
        var params = { 'objectId': transaction.objectId };
        var data = { 'note': transaction.note };
        return resourse.updateTransaction(params, data).$promise;
      }
    }, {
      key: 'updateTransactionValue',
      value: function updateTransactionValue(transaction) {
        var params = { 'objectId': transaction.objectId };
        var data = { 'value': +transaction.value };
        return resourse.updateTransaction(params, data).$promise;
      }
    }, {
      key: 'updateTransactionLabel',
      value: function updateTransactionLabel(transaction) {
        var params = { 'objectId': transaction.objectId };
        var data = { 'labels': transaction.labels };
        return resourse.updateTransaction(params, data).$promise;
      }
    }, {
      key: 'updateTransaction',
      value: function updateTransaction(transaction) {
        var params = { 'objectId': transaction.objectId };
        return resourse.updateTransaction(params, TransactionMapper.normalize(transaction)).$promise;
      }
    }]);

    return transactionRepository;
  }();
}]);
'use strict';

app.factory('transactionResource', ['$resource', function ($resource) {
  return $resource(API_HOST + '/Transaction/:objectId?:readId', { 'objectId': '@objectId' }, {
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
  });
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('notifyService', ['$timeout', 'lodash', function ($timeout, _) {
  var notify = function () {
    function notify() {
      _classCallCheck(this, notify);

      this.notifies = [];
    }

    _createClass(notify, [{
      key: 'add',
      value: function add(type, text, timer) {
        var _this = this;

        var notify = { text: text, type: type, timer: timer };
        this.notifies.push(notify);
        if (timer) {
          $timeout(function () {
            _this.remove(notify);
          }, timer);
        }
      }
    }, {
      key: 'remove',
      value: function remove(notify) {
        _.remove(this.notifies, function (elem) {
          return elem === notify;
        });
      }
    }]);

    return notify;
  }();

  return new notify();
}]);