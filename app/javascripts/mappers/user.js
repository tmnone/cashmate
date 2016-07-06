app.factory('userMapper', 
['UserEntity', (UserEntity) =>
  class userMapper {
    static load (user) {
      return new UserEntity(user);
    }

    // static userQuery (userId) {
    //   return JSON.stringify({ 
    //     __type: "Pointer", 
    //     className: "_User", 
    //     objectId: userId
    //   })
    // }

    // static normalize (user) {
    //   return JSON.stringify({ 
    //     objectId = user.objectId;
    //     username = user.username;
    //     email = user.email;
    //     password = user.password;
    //     sessionToken = user.sessionToken;
    //   })
    // }
  }
]);