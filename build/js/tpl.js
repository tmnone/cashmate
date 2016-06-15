angular.module("templatescache", []).run(["$templateCache", function($templateCache) {$templateCache.put("edit-panel.html","<div class=\"edit-panel\">\n  <span class=\"edit-panel-link\" ng-click=\"toggle()\">{{editData}}</span>\n  <div class=\"edit-panel-form form-inline\">\n    <input type=\"text\" class=\"form-control input-sm\" ng-list ng-model=\"editData\" ng-show=\"isArray\">\n    <input type=\"text\" class=\"form-control input-sm\" ng-model=\"editData\" ng-hide=\"isArray\">\n    <button class=\"btn btn-sm btn-primary\" ng-click=\"save(); toggle()\">Ok</button>\n    <button class=\"btn btn-sm btn-default\" ng-click=\"toggle()\"><span class=\"fa fa-times\"></span></button>\n  </div>\n</div>");
$templateCache.put("notify.html","<div class=\"notifies-wrapper fade\" ng-class=\"{\'in\': notifies.length}\">\n  <div ng-repeat=\"notify in notifies\">\n    <div class=\"alert alert-{{notify.type}} alert-dismissible\">\n      <button type=\"button\" class=\"close\" ng-click=\"removeNotify(notify)\">×</button>\n      <span>{{notify.text}}</span>\n    </div>  \n  </div>\n</div>");
$templateCache.put("pagination.html","<div class=\"pagination-wrapper\">\n  <ul class=\"pagination\">\n    <li ng-repeat=\"page in pages\">\n      <a href=\"#\" ng-class=\"{\'active\': page == activePage}\" ng-click=\"goTo($event, page)\">{{page}}</a>\n    </li>\n  </ul>\n</div>");}]);