app.factory('userRepository', 
['userResource', 'userMapper',
(resourse, userMapper) =>
  class userRepository {
    
    // static create (param) {
    //   return resourse.create(param).$promise.then((res) => {
    //     return res;
    //   });
    // }

    static login (userCredentials) {
      return resourse.login(userCredentials).$promise.then((res) => {
        return userMapper.load(res);
      });
    }

    static logout () {
      return resourse.logout().$promise.then((res) => {
        return res;
      });
    }

    static getUserById (userId) {
      return resourse.getUserById({userId}).$promise.then((res) => {
        return userMapper.load(res);
      });
    }

    static getUserBySessionId (sessionId) {
      return resourse.getUserBySessionId({sessionId}).$promise
        .then((res) => {
          let userId = res.user.objectId;
          return resourse.getUserById({userId}).$promise
        })
        .then((user) => {
          return userMapper.load(user);
        });
    }

    static getSessionId (sessionToken) {
      let where = {sessionToken};
      return resourse.getSession({where}).$promise.then((res) => {
        return res.results[0].objectId;
      });
    }

  }
]);