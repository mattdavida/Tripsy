angular.module("mainController", ["authServices", "userServices"])
    .controller("mainCtrl", function (Auth, User, AuthToken, $timeout, $location, $rootScope, $window, $interval, $route, $scope) {
    var _this = this;
    $scope.$on('$routeChangeSuccess', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.bodyClass = $route.current.viewClass;
        }
    });
    this.showModal = function (option) {
        var _this = this;
        this.choiceMade = false;
        this.hideButton = false;
        this.authorized = false;
        this.modalHeader = undefined;
        this.modalBody = undefined;
        if (option === 2) {
            this.hideButton = true;
            this.modalHeader = "Logging out";
            $("#myModal")["modal"]({ backdrop: "static" });
            $location.path("/");
            $timeout(function () {
                Auth.logout();
                $window.location.reload();
            }, 1000);
            $timeout(function () {
                _this.hideModal();
            }, 2000);
        }
        ;
    };
    this.hideModal = function () {
        $("#myModal")["modal"]("hide");
    };
    $rootScope.$on("$routeChangeStart", function () {
        if (Auth.isLoggedIn()) {
            _this.isLoggedIn = true;
            Auth.getUser().then(function (data) {
                _this.username = data.data.username;
                _this.email = data.data.email;
                User.getPermission().then(function (data) {
                    if (data.data.permission === "admin" || data.data.permission === "moderator") {
                        _this.authorized = true;
                    }
                    ;
                }).catch(function (err) {
                    console.error(err);
                });
            }).catch(function (err) {
                console.error(err);
                _this.username = "";
            });
        }
        else {
            _this.isLoggedIn = false;
        }
        if ($location.hash() == "_=_") {
            $location.hash(null);
        }
    });
    this.facebook = function () {
        $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/facebook";
    };
    this.twitter = function () {
        $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/twitter";
    };
    this.google = function () {
        $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/google";
    };
    this.doLogin = function (loginData) {
        _this.loading = true;
        _this.errorMessage = false;
        Auth.login(_this.loginData).then(function (data) {
            if (data.data.success) {
                _this.loading = false;
                _this.successMessage = data.data.message + "...Redirecting";
                $timeout(function () {
                    $location.path("/profile");
                    _this.loginData = "";
                    _this.successMessage = false;
                }, 2000);
            }
            else {
                _this.loading = false;
                _this.errorMessage = data.data.message;
                $timeout(function () {
                    _this.errorMessage = false;
                }, 2000);
            }
            ;
        });
    };
    this.logout = function () {
        _this.showModal(2);
    };
});
