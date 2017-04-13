angular.module("userControllers", ["userServices"])

.controller("registrationController", function($http, $location, $timeout, User, $window) {

  this.registerUser = (regData) => {
    this.loading = true;
    this.errorMessage = false;
    User.create(this.regData).then((data) => {
      if(data.data.success) {
        this.loading = false;
        this.successMessage = data.data.message + "...Redirecting";
        $timeout(() => {
          $location.path("/");
          $window.location.reload();
        }, 2000);
      }  else {
        this.loading = false;
        this.errorMessage = data.data.message;
      };
    });
  };
})

.controller("facebookController", function($routeParams, $location, $window, $timeout, $interval, Auth) {

  if($window.location.pathname === "/facebookerror") {
    this.errorMessage = "Facebook e-mail not found in database.";
    $timeout(() => {
      this.errorMessage = false;
    }, 3000);
  }  else {
    Auth.facebook($routeParams.token);
    $location.path("/profile");
  };
})

.controller("twitterController", function($routeParams, $location, $window, $timeout, Auth, $interval) {

  if($window.location.pathname === "/twittererror") {
    this.errorMessage = "Twitter e-mail not found in database.";
    $timeout(() => {
      this.errorMessage = false;
    }, 3000);
  }  else {
    Auth.facebook($routeParams.token);
    $location.path("/profile");
  };
})

.controller("googleController", function($routeParams, $location, $window, $timeout, Auth, $interval) {

  if($window.location.pathname === "/googleerror") {
    this.errorMessage = "Google e-mail not found in database.";
    $timeout(() => {
      this.errorMessage = false;
    }, 3000);
  }  else {
    Auth.facebook($routeParams.token);
    $location.path("/profile");
  };
});
