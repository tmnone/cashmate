app.directive('notify', ['$templateCache', 'notifyService', ($templateCache, notify) => {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    template: $templateCache.get("notify.html"),
    link: function(scope, element, attrs) {
      scope.notifies = notify.notifies;
      
      scope.removeNotify = function (msg) {
        notify.remove(msg);
      }
    }
  }
}]);