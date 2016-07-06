app.factory('UserEntity', () => 
  class UserEntity {
    constructor (attr = {}) {
      this.userId = attr.objectId;
      this.username = attr.username;
      this.email = attr.email;
      this.sessionToken = attr.sessionToken;
    }
  }
);