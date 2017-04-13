angular.module("authServices", [])

.factory("Auth", function($http, $q, AuthToken) {
  this.authFactory = {};

  this.authFactory.login = function(loginData) {
    return $http.post("/api/users/authenticate", loginData).then((data) => {
      AuthToken.setToken(data.data.token);
      return data;
    }).catch((err) => {
      console.error(err);
    });
  };

  this.authFactory.isLoggedIn = function() {
    if(AuthToken.getToken()) {
      return true;
    } else {
      return false;
    };
  };

  this.authFactory.facebook = function(token) {
    AuthToken.setToken(token);
  };

  this.authFactory.getUser = function() {
    if(AuthToken.getToken()) {
      return $http.post("/api/users/current");
    } else {
      $q.reject({message: "User has no token"})
    };
  };

  this.authFactory.logout = function() {
    AuthToken.setToken();
  };

  return this.authFactory;
})

.factory("AuthToken", function($window) {
  this.authTokenFactory = {};

  this.authTokenFactory.setToken = function(token) {
    if(token) {
      $window.localStorage.setItem("token", token);
    } else {
      $window.localStorage.removeItem("token", token);
    };
  };

  this.authTokenFactory.getToken = function() {
    return $window.localStorage.getItem("token");
  };

  return this.authTokenFactory;
})

.factory("AuthInterceptors", function(AuthToken) {
  this.AuthInterceptorsFactory = {};
  this.AuthInterceptorsFactory.request = function(config) {
    let token = AuthToken.getToken();

    if(token) {
      config.headers["x-access-token"] = token;
    };
    return config;
  }

  return this.AuthInterceptorsFactory;
});
