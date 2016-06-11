app.directive('editPanel', ['$templateCache', ($templateCache) => {
  return {
    restrict: 'E',
    scope: {
      editData: '=',
      onSave: '&'
    },
    template: $templateCache.get("edit-panel.html"),
    link: function(scope, element, attrs) {
      scope.isArray = attrs.array

      scope.toggle = function() {
        element.toggleClass('edit-panel--opened');
      }

      scope.save = function(){
        scope.onSave({'editData': scope.editData});
      }
    }
  }
}]);