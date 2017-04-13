angular.module("userControllers", ["userServices"])
    .controller("registrationController", function ($http, $location, $timeout, User, $window) {
    var _this = this;
    this.registerUser = function (regData) {
        _this.loading = true;
        _this.errorMessage = false;
        User.create(_this.regData).then(function (data) {
            if (data.data.success) {
                _this.loading = false;
                _this.successMessage = data.data.message + "...Redirecting";
                $timeout(function () {
                    $location.path("/");
                    $window.location.reload();
                }, 2000);
            }
            else {
                _this.loading = false;
                _this.errorMessage = data.data.message;
            }
            ;
        });
    };
})
    .controller("facebookController", function ($routeParams, $location, $window, $timeout, $interval, Auth) {
    var _this = this;
    if ($window.location.pathname === "/facebookerror") {
        this.errorMessage = "Facebook e-mail not found in database.";
        $timeout(function () {
            _this.errorMessage = false;
        }, 3000);
    }
    else {
        Auth.facebook($routeParams.token);
        $location.path("/profile");
    }
    ;
})
    .controller("twitterController", function ($routeParams, $location, $window, $timeout, Auth, $interval) {
    var _this = this;
    if ($window.location.pathname === "/twittererror") {
        this.errorMessage = "Twitter e-mail not found in database.";
        $timeout(function () {
            _this.errorMessage = false;
        }, 3000);
    }
    else {
        Auth.facebook($routeParams.token);
        $location.path("/profile");
    }
    ;
})
    .controller("googleController", function ($routeParams, $location, $window, $timeout, Auth, $interval) {
    var _this = this;
    if ($window.location.pathname === "/googleerror") {
        this.errorMessage = "Google e-mail not found in database.";
        $timeout(function () {
            _this.errorMessage = false;
        }, 3000);
    }
    else {
        Auth.facebook($routeParams.token);
        $location.path("/profile");
    }
    ;
});
