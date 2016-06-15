app.directive('pagination', ['$templateCache', ($templateCache) => {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=',
      itemsShow: '=',
      activePage: '=',
      goToPage: '&'
    },
    template: $templateCache.get("pagination.html"),
    link: function(scope, element, attrs) {

      scope.pages = [];
      
      scope.makePages = function(pages){
        for (var i = 0; i < pages; i++) {
          scope.pages.push(i+1);
        }
      }

      scope.$watchGroup(['totalItems', 'itemsShow'], function(){
        scope.makePages(Math.ceil(scope.totalItems / scope.itemsShow));
      });

      scope.goTo = function($event, page) {
        $event.preventDefault();
        scope.goToPage({'page': page});
      }
    }
  }
}]);