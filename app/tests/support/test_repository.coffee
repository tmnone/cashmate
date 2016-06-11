class TestRepository
  constructor: (responseMapping)->
    methods = Object.keys(responseMapping)
    for methodName in methods
      response = responseMapping[methodName]
      @[methodName] = ->
        response
      spyOn(@, methodName).and.returnValue(response)