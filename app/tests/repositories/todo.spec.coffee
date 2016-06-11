describe "todoRepository", ->
  todoRepository = null
  todoId = 0
  todo = { id: todoId, title: 'Todo title', description: '', done: false }

  beforeEach ->
    # module 'todoApp'
    $injector = angular.injector(['todoApp'])
    todoRepository = $injector.get('todoRepository')
    todoRepository.addTodo(todo)


  describe "read()", ->
    it "should return single todo", ->
      expect(todoRepository.read(todoId)).toBeObject()

  describe "readAll()", ->
    it "should return todo list", ->      
      todoRepository.addTodo({id: todoId + 1, title: 'Todo title'})
      expect(todoRepository.readAll()).toBeArrayOfObjects()

  describe "removeTodo()", ->
    it "should remove todo", ->
      todoRepository.removeTodo(todo)
      expect(todoRepository.read(todoId)).toBeUndefined()

  describe "updateTitle()", ->
    it "should update todo title", ->
      newTitle = 'New Title'
      todoRepository.updateTitle(todoId, newTitle)
      expect(todoRepository.read(todoId).title).toBe(newTitle)

  describe "updateDescription()", ->
    it "should update todo description", ->
      newDescription = 'New Description'
      todoRepository.updateDescription(todoId, newDescription)
      expect(todoRepository.read(todoId).description).toBe(newDescription)