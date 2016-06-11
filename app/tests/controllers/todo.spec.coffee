describe "IndexPageController", ->

  beforeEach(module('todoApp'))

  $controller = $rootScope = $scope = {}

  beforeEach ->

    inject ['$rootScope', '$controller', (_$rootScope_, _$controller_) ->
      $rootScope = _$rootScope_
      $scope = $rootScope.$new()
      $controller = _$controller_
    ]

  describe "title", ->
    it "should be a string", ->
      controller = $controller 'IndexPageController',
        $scope: $scope

      $scope.newTodoTitle = 'Title'

      expect($scope.newTodoTitle).toBeString()