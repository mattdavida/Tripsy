namespace myapp {
  var app = angular.module("appRoutes", ["ngRoute"])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider

    .when("/", {
      templateUrl: '/ngApp/views/home.html',
      viewClass: "class1",
      authenticated: false
    })

    .when("/social", {
      templateUrl: '/ngApp/views/users/social/social.html',
    })

    .when("/register", {
      templateUrl: "/ngApp/views/users/register.html",
      controller: "registrationController",
      controllerAs: "controller",
      viewClass: "class1",
      authenticated: false
    })

    .when("/login", {
      templateUrl: "/ngApp/views/users/login.html",
      authenticated: false,
      viewClass: "class1"
    })

    .when("/profile", {
      templateUrl: "/ngApp/views/users/profile.html",
      authenticated: true
    })

    .when("/facebook/:token", {
      templateUrl: "/ngApp/views/users/social/social.html",
      controller: "facebookController",
      controllerAs: "facebook",
      authenticated: false
    })

    .when("/twitter/:token", {
      templateUrl: "/ngApp/views/users/social/social.html",
      controller: "twitterController",
      controllerAs: "twitter",
      authenticated: false
    })

    .when("/google/:token", {
      templateUrl: "/ngApp/views/users/social/social.html",
      controller: "googleController",
      controllerAs: "google",
      authenticated: false
    })

    .when("/facebookerror", {
      templateUrl: "/ngApp/views/users/login.html",
      controller: "facebookController",
      controllerAs: "facebook",
      viewClass: "class1",
      authenticated: false
    })

    .when("/twittererror", {
      templateUrl: "/ngApp/views/users/login.html",
      controller: "twitterController",
      controllerAs: "twitter",
      viewClass: "class1",
      authenticated: false
    })

    .when("/googleerror", {
      templateUrl: "/ngApp/views/users/login.html",
      controller: "googleController",
      controllerAs: "google",
      viewClass: "class1",
      authenticated: false
    })

    .when("/management", {
      templateUrl: "/ngApp/views/userManagement/management.html",
      controller: "managementController",
      controllerAs: "management",
      authenticated: true,
      permission: ["admin", "moderator"]
    })

    .when("/edit/:id", {
      templateUrl: "/ngApp/views/userManagement/edit.html",
      controller: "editController",
      controllerAs: "edit",
      authenticated: true,
      permission: ["admin", "moderator"]
    })

    .when("/travel/", {
      templateUrl: "/ngApp/views/trips/travel.html",
      controller: "tripCtrl",
      controllerAs: "trip",
      authenticated: true

    })

    .when("/tripEdit/:id", {
      templateUrl: "/ngApp/views/trips/tripEdit.html",
      controller: "tripEditController",
      controllerAs: "trip",
      authenticated: true
    })

    .otherwise({
      redirectTo: "/login"
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });

  app.run(["$rootScope", "$location", "Auth", "User", function($rootScope, $location, Auth, User) {

    $rootScope.$on("$routeChangeStart", (event, next, current) => {
      if(next.$$route !== undefined) {
        if(next.$$route.authenticated === true) {
          if(!Auth.isLoggedIn()) {
            event.preventDefault();
            $location.path("/");
          } else if(next.$$route.permission) {
            User.getPermission().then((data) => {
              if(next.$$route.permission[0] !== data.data.permission) {
                if(next.$$route.permission[1] !== data.data.permission) {
                  event.preventDefault();
                  $location.path("/");
                }
              }
            });
          }
        }  else if(next.$$route.authenticated === false) {
            if(Auth.isLoggedIn()) {
              event.preventDefault();
              $location.path("/profile");
          }
        }
      }
    });
  }])

app.run(function ($rootScope, $timeout, $window) {
  $rootScope.$on('$routeChangeSuccess', function () {
    $timeout(function () {
      $window.scrollTo(0,0);
    }, 500);
  });
})
}
