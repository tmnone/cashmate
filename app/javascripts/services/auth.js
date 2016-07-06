app.factory('authService', 
['$rootScope', 'userRepository', 'localStorageService',
($rootScope,   userRepository,   localStorageService) => {
  class authService {

    constructor () {
      this.store = localStorageService;
    }

    sessionId () {
      return this.store.get('sessionId')
    }

    sessionToken () {
      return this.store.get('sessionToken')
    }

    getSessionId (sessionToken) {
      return userRepository.getSessionId(sessionToken).then((sessionId) => {
        this.store.set('sessionId', sessionId);
        return sessionId;
      });
    }


    getUserBySessionId (sessionId) {
      return userRepository.getUserBySessionId(sessionId).then((user) => {
        $rootScope.currentUser = user;
        return user;
      });
    }

    getUserById (userId) {
      return userRepository.getUserById(userId).then((user) => {
        $rootScope.currentUser = user;
        return user;
      });
    }

    login (userCredentials) {
      return userRepository.login(userCredentials).then((user) => {
        $rootScope.currentUser = user;
        this.store.set('sessionToken', user.sessionToken);
        return user;
      });
    }

    logout () {
      return userRepository.logout().then((res) => {
        this.store.set('sessionId', null);
        this.store.set('sessionToken', null);
        $rootScope.currentUser = null;
        return res;
      });
    }

  }

  return new authService();
}
]);