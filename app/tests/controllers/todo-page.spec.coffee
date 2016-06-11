describe "TodoPageController", ->
  $rootScope = $scope = $routeParams = {}
  $controller = null
  todoRepository = null

  sampleTodo = {id: 1, title: "Title"}

  beforeEach ->
    module 'todoApp', ['$provide', ($provide)->
      # Inject test repositories and return sample todo on read
      todoRepository = new TestRepository({"read": sampleTodo})
      $provide.value('todoRepository', todoRepository)
      return null
    ]

    inject ['$rootScope', '$controller', (_$rootScope_, _$controller_) ->
      $rootScope = _$rootScope_
      $scope = $rootScope.$new()
      $controller = _$controller_
    ]

  describe "todo Page", ->
    it "should get a todo", ->
      $routeParams.id = 0
      $controller 'TodoPageController',
        $scope: $scope
        $routeParams: $routeParams

      expect($scope.todo).toBeNonEmptyObject()
