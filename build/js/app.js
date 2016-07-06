'use strict';

var app = angular.module('cashmateApp', ['ngRoute', 'ngResource', 'ngLodash', 'templatescache', 'LocalStorageModule']);
'use strict';

app.config(['$routeProvider', '$locationProvider', 'localStorageServiceProvider', function ($routeProvider, $locationProvider, localStorageServiceProvider) {
  $routeProvider.when('/signin', {
    templateUrl: '../pages/signin.html',
    controller: 'SigninPageController'
  }).when('/transaction/new', {
    templateUrl: '../pages/transaction-new.html',
    controller: 'TransactionNewPageController',
    resolve: {
      currentUser: 'currentUserService'
    }
  }).when('/transaction/edit/:id', {
    templateUrl: '../pages/transaction-edit.html',
    controller: 'TransactionEditPageController',
    resolve: {
      currentUser: 'currentUserService'
    }
  }).otherwise({
    redirectTo: '/',
    templateUrl: '../pages/index.html',
    controller: 'IndexPageController',
    resolve: {
      currentUser: 'currentUserService'
    }
  });
  $locationProvider.html5Mode();
  localStorageServiceProvider.setPrefix('cashmateApp');
}]);

app.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
  $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '60w8hWaSMAJRkQkPEQEnz4mDnK64TDibBaYMPH1u';
  $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SvFh7Tz0yQP5fadnL2Imknux9runUdnEU5uGGC5j';
}]);
'use strict';

app.run(['$http', '$route', '$rootScope', '$location', 'authService', function ($http, $route, $rootScope, $location, authService) {
  $rootScope.$on('$routeChangeStart', function (e) {
    if (!authService.sessionId()) {
      $location.path('/signin');
    }
  });
}]);
'use strict';

// let API_HOST = 'http://localhost:9000/api';
var API_HOST = 'https://parseapi.back4app.com/classes';
// let IP_ID = '60w8hWaSMAJRkQkPEQEnz4mDnK64TDibBaYMPH1u';
'use strict';

app.controller('IndexPageController', ['$rootScope', '$scope', 'userRepository', 'transactionRepository', 'notifyService', function ($rootScope, $scope, userRepository, transactionRepository, notify) {

  $scope.user = $rootScope.currentUser;

  $scope.transactions = [];
  $scope.itemStart = 0;
  $scope.itemsShow = 4;
  $scope.activePage = 1;

  $scope.renderPage = function (page) {
    $scope.activePage = page;
    $scope.itemStart = $scope.itemsShow * ($scope.activePage - 1);
    transactionRepository.readPage($scope.itemStart, $scope.itemsShow).then(function (res) {
      $scope.transactions = res.results;
      $scope.totalItems = res.count;
      return res;
    });
  };

  $scope.renderPage($scope.activePage);

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

app.controller('SigninPageController', ['$location', '$rootScope', '$scope', 'authService', 'notifyService', function ($location, $rootScope, $scope, authService, notify) {

  $scope.user = {};

  $scope.userSignIn = function () {

    authService.login($scope.user).then(function (res) {
      // console.log('LOGIN USER', res);
      return authService.getSessionId($rootScope.currentUser.sessionToken);
    }).then(function (session) {
      notify.add('success', 'Successfully SignIn!', 5000);
      $location.path('/');
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

app.directive('pagination', ['$templateCache', function ($templateCache) {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=',
      itemsShow: '=',
      activePage: '=',
      goToPage: '&'
    },
    template: $templateCache.get("pagination.html"),
    link: function link(scope, element, attrs) {

      scope.pages = [];

      scope.makePages = function (pages) {
        for (var i = 0; i < pages; i++) {
          scope.pages.push(i + 1);
        }
      };

      scope.$watchGroup(['totalItems', 'itemsShow'], function () {
        scope.makePages(Math.ceil(scope.totalItems / scope.itemsShow));
      });

      scope.goTo = function ($event, page) {
        $event.preventDefault();
        scope.goToPage({ 'page': page });
      };
    }
  };
}]);
'use strict';

app.directive('siteHeader', ['$rootScope', '$templateCache', '$location', 'authService', 'notifyService', function ($rootScope, $templateCache, $location, authService, notify) {
  return {
    restrict: 'E',
    // scope: {},
    template: $templateCache.get("site-header.html"),
    link: function link(scope, element, attrs) {

      $rootScope.$watch("currentUser", function () {
        scope.user = $rootScope.currentUser;
      });

      scope.userSignOut = function () {
        authService.logout().then(function (res) {
          notify.add('info', 'You`ve Signed Out!', 5000);
          $location.path('/signin');
        });
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
    this.owner = attr.owner;
    this.date = attr.date;
    this.value = attr.value;
    this.note = attr.note;
  };
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('UserEntity', function () {
  return function UserEntity() {
    var attr = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, UserEntity);

    this.userId = attr.objectId;
    this.username = attr.username;
    this.email = attr.email;
    this.sessionToken = attr.sessionToken;
  };
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('transactionRepository', ['$rootScope', 'transactionResource', 'TransactionMapper', 'userMapper', function ($rootScope, resourse, TransactionMapper, userMapper) {
  return function () {
    function transactionRepository() {
      _classCallCheck(this, transactionRepository);
    }

    _createClass(transactionRepository, null, [{
      key: 'readPage',
      value: function readPage(skip, limit) {
        var params = {
          "skip": skip,
          "limit": limit,
          "where": { "owner": { "__type": "Pointer", "className": "_User", "objectId": $rootScope.currentUser.userId } }
        };
        return resourse.readPage(params).$promise.then(function (res) {
          res.results = res.results.map(TransactionMapper.load);
          return res;
        });
      }
    }, {
      key: 'readAll',
      value: function readAll() {
        var where = { "owner": { "__type": "Pointer", "className": "_User", "objectId": $rootScope.currentUser.userId } };
        return resourse.readAll({ where: where }).$promise.then(function (res) {
          res.results = res.results.map(TransactionMapper.load);
          return res;
        });
      }
    }, {
      key: 'read',
      value: function read(id) {
        var where = { "objectId": id };
        return resourse.read({ where: where }).$promise.then(function (res) {
          res.results = res.results.map(TransactionMapper.load);
          return res;
        });
      }
    }, {
      key: 'addTransaction',
      value: function addTransaction(transaction) {
        return resourse.addTransaction(TransactionMapper.normalize(transaction)).$promise;
      }
    }, {
      key: 'updateTransactionNote',
      value: function updateTransactionNote(transaction) {
        var params = { "objectId": transaction.objectId };
        var data = { "note": transaction.note };
        return resourse.updateTransaction(params, data).$promise;
      }
    }, {
      key: 'updateTransactionValue',
      value: function updateTransactionValue(transaction) {
        var params = { "objectId": transaction.objectId };
        var data = { "value": +transaction.value };
        return resourse.updateTransaction(params, data).$promise;
      }
    }, {
      key: 'updateTransactionLabel',
      value: function updateTransactionLabel(transaction) {
        var params = { "objectId": transaction.objectId };
        var data = { "labels": transaction.labels };
        return resourse.updateTransaction(params, data).$promise;
      }
    }, {
      key: 'updateTransaction',
      value: function updateTransaction(transaction) {
        var params = { "objectId": transaction.objectId };
        return resourse.updateTransaction(params, TransactionMapper.normalize(transaction)).$promise;
      }
    }]);

    return transactionRepository;
  }();
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('userRepository', ['userResource', 'userMapper', function (resourse, userMapper) {
  return function () {
    function userRepository() {
      _classCallCheck(this, userRepository);
    }

    _createClass(userRepository, null, [{
      key: 'login',


      // static create (param) {
      //   return resourse.create(param).$promise.then((res) => {
      //     return res;
      //   });
      // }

      value: function login(userCredentials) {
        return resourse.login(userCredentials).$promise.then(function (res) {
          return userMapper.load(res);
        });
      }
    }, {
      key: 'logout',
      value: function logout() {
        return resourse.logout().$promise.then(function (res) {
          return res;
        });
      }
    }, {
      key: 'getUserById',
      value: function getUserById(userId) {
        return resourse.getUserById({ userId: userId }).$promise.then(function (res) {
          return userMapper.load(res);
        });
      }
    }, {
      key: 'getUserBySessionId',
      value: function getUserBySessionId(sessionId) {
        return resourse.getUserBySessionId({ sessionId: sessionId }).$promise.then(function (res) {
          var userId = res.user.objectId;
          return resourse.getUserById({ userId: userId }).$promise;
        }).then(function (user) {
          return userMapper.load(user);
        });
      }
    }, {
      key: 'getSessionId',
      value: function getSessionId(sessionToken) {
        var where = { sessionToken: sessionToken };
        return resourse.getSession({ where: where }).$promise.then(function (res) {
          return res.results[0].objectId;
        });
      }
    }]);

    return userRepository;
  }();
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('authService', ['$rootScope', 'userRepository', 'localStorageService', function ($rootScope, userRepository, localStorageService) {
  var authService = function () {
    function authService() {
      _classCallCheck(this, authService);

      this.store = localStorageService;
    }

    _createClass(authService, [{
      key: 'sessionId',
      value: function sessionId() {
        return this.store.get('sessionId');
      }
    }, {
      key: 'sessionToken',
      value: function sessionToken() {
        return this.store.get('sessionToken');
      }
    }, {
      key: 'getSessionId',
      value: function getSessionId(sessionToken) {
        var _this = this;

        return userRepository.getSessionId(sessionToken).then(function (sessionId) {
          _this.store.set('sessionId', sessionId);
          return sessionId;
        });
      }
    }, {
      key: 'getUserBySessionId',
      value: function getUserBySessionId(sessionId) {
        return userRepository.getUserBySessionId(sessionId).then(function (user) {
          $rootScope.currentUser = user;
          return user;
        });
      }
    }, {
      key: 'getUserById',
      value: function getUserById(userId) {
        return userRepository.getUserById(userId).then(function (user) {
          $rootScope.currentUser = user;
          return user;
        });
      }
    }, {
      key: 'login',
      value: function login(userCredentials) {
        var _this2 = this;

        return userRepository.login(userCredentials).then(function (user) {
          $rootScope.currentUser = user;
          _this2.store.set('sessionToken', user.sessionToken);
          return user;
        });
      }
    }, {
      key: 'logout',
      value: function logout() {
        var _this3 = this;

        return userRepository.logout().then(function (res) {
          _this3.store.set('sessionId', null);
          _this3.store.set('sessionToken', null);
          $rootScope.currentUser = null;
          return res;
        });
      }
    }]);

    return authService;
  }();

  return new authService();
}]);
'use strict';

app.factory('currentUserService', ['$route', '$rootScope', '$location', 'authService', function ($route, $rootScope, $location, authService) {
  var sessionId = authService.sessionId();
  if (sessionId && !$rootScope.currentUser) {
    return authService.getUserBySessionId(sessionId).then(function (user) {
      $rootScope.currentUser = user;
      return user;
    });
  } else {
    return null;
  }
}]);
'use strict';

app.factory('httpInterceptor', ['$injector', function ($injector) {
  return {
    request: function request(config) {
      $injector.invoke(['authService', function (authService) {
        if (authService.sessionToken()) {
          config.headers['X-Parse-Session-Token'] = authService.sessionToken();
        }
      }]);
      return config;
    }
  };
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
        _.pull(this.notifies, notify);
      }
    }]);

    return notify;
  }();

  return new notify();
}]);
'use strict';

app.factory('transactionResource', ['$resource', function ($resource) {
  return $resource(API_HOST + '/Transaction/:objectId', { 'objectId': '@objectId' }, {
    readPage: {
      method: 'GET',
      params: {
        where: '@where',
        skip: '@skip',
        limit: '@limit',
        count: 1
      }
    },

    read: {
      method: 'GET',
      params: {
        where: '@where'
      }
    },

    readAll: {
      method: 'GET',
      params: {
        where: '@where'
      }
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

app.factory('userResource', ['$resource', function ($resource) {
  return $resource(API_HOST, {}, {
    create: {
      method: 'POST',
      url: API_HOST + '/_User'
    },

    getUserById: {
      method: 'GET',
      url: API_HOST + '/_User/:userId'
    },

    getUserBySessionId: {
      method: 'GET',
      url: API_HOST + '/_Session/:sessionId'
    },

    login: {
      method: 'GET',
      url: 'https://parseapi.back4app.com/login'
    },

    logout: {
      method: 'POST',
      url: 'https://parseapi.back4app.com/logout'
    },

    getSession: {
      method: 'GET',
      url: API_HOST + '/_Session',
      params: {
        where: '@where'
      }
    }
  });
}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

app.factory('TransactionMapper', ['$rootScope', 'TransactionEntity', function ($rootScope, TransactionEntity) {
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
          owner: {
            __type: "Pointer",
            className: "_User",
            objectId: $rootScope.currentUser.userId
          },
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

app.factory('userMapper', ['UserEntity', function (UserEntity) {
  return function () {
    function userMapper() {
      _classCallCheck(this, userMapper);
    }

    _createClass(userMapper, null, [{
      key: 'load',
      value: function load(user) {
        return new UserEntity(user);
      }

      // static userQuery (userId) {
      //   return JSON.stringify({
      //     __type: "Pointer",
      //     className: "_User",
      //     objectId: userId
      //   })
      // }

      // static normalize (user) {
      //   return JSON.stringify({
      //     objectId = user.objectId;
      //     username = user.username;
      //     email = user.email;
      //     password = user.password;
      //     sessionToken = user.sessionToken;
      //   })
      // }

    }]);

    return userMapper;
  }();
}]);