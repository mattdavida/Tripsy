angular.module("mainController", ["authServices", "userServices"])

.controller("mainCtrl", function(Auth, User, AuthToken, $timeout, $location, $rootScope, $window, $interval, $route, $scope) {

  $scope.$on('$routeChangeSuccess', function(newValue, oldValue) {
      if ( newValue !== oldValue ) {
          $scope.bodyClass = $route.current.viewClass;
      }
  });

  this.showModal = function(option) {
    this.choiceMade = false;
    this.hideButton = false;
    this.authorized = false;
    this.modalHeader = undefined;
    this.modalBody = undefined;

    if(option === 2) {
      //logout portion
      this.hideButton = true;
      this.modalHeader = "Logging out";
      $("#myModal")["modal"]({backdrop: "static"});
      $location.path("/");
      $timeout(() => {
        Auth.logout();
        $window.location.reload();
      }, 1000);
      $timeout(() => {
        this.hideModal();
      }, 2000);
    };
  };

  this.hideModal = function() {
    $("#myModal")["modal"]("hide");
  };

  $rootScope.$on("$routeChangeStart", () => {

    if(Auth.isLoggedIn()){
      this.isLoggedIn = true;
      Auth.getUser().then((data) => {
        this.username = data.data.username;
        this.email = data.data.email;
        User.getPermission().then((data) => {
          if(data.data.permission === "admin" || data.data.permission === "moderator") {
            this.authorized = true;
          };
        }).catch((err) => {
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
        this.username = "";
      });
    }  else {
      this.isLoggedIn = false;
    }
    if($location.hash() == "_=_") {
      $location.hash(null); //Check for Fb hash in url
    }
  });

  this.facebook = function() {
  //  console.log($window.location.host); //localhost:3000
  //  console.log($window.location.protocol); //http
    $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/facebook";

  };

  this.twitter = function() {
  //  console.log($window.location.host); //localhost:3000
  //  console.log($window.location.protocol); //http
    $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/twitter";
  };

  this.google = function() {
  //  console.log($window.location.host); //localhost:3000
  //  console.log($window.location.protocol); //http
    $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/google";
  };

  this.doLogin = (loginData) => {
    this.loading = true;
    this.errorMessage = false;

    Auth.login(this.loginData).then((data) => {
      if(data.data.success) {
        this.loading = false;
        this.successMessage = data.data.message + "...Redirecting";
        $timeout(() => {
          $location.path("/profile");
          this.loginData = "";
          this.successMessage = false;
        }, 2000);
      }  else {
        this.loading = false;
        this.errorMessage = data.data.message;
        $timeout(() => {
          this.errorMessage = false;
        }, 2000);
      };
    });
  };

  this.logout = () => {
    this.showModal(2);
  };
});
