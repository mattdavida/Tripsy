angular.module("userManagementController", [])
    .controller("managementController", function (User, $timeout, $scope, $window, $route) {
    this.users;
    this.hasUsers = false;
    this.loading2 = false;
    this.accessDenied = true;
    this.errorMessage = false;
    this.editAccess = false;
    this.deleteAccess = false;
    this.limit;
    this.userId = null;
    this.getUsers = function () {
        var _this = this;
        User.getUsers().then(function (data) {
            var token = window.localStorage['token'];
            var payload = JSON.parse(window.atob(token.split('.')[1]));
            if (data.data.success === true) {
                if (data.data.permission === "admin" || data.data.permission === "moderator") {
                    var filter = data.data.users.filter(function (val) { return val.username !== payload.username; });
                    _this.users = filter;
                    _this.accessDenied = false;
                    if (_this.users < 1) {
                        $timeout(function () {
                            _this.hasUsers = false;
                        }, 2000);
                    }
                    else {
                        _this.hasUsers = true;
                    }
                    if (data.data.permission === "admin") {
                        _this.editAccess = true;
                        _this.deleteAccess = true;
                    }
                    else if (data.data.permission === "moderator") {
                        _this.editAccess = true;
                    }
                }
                else {
                    _this.errorMessage = "Insufficient Permissions";
                }
            }
            else {
                _this.errorMessage = data.data.message;
            }
            ;
        });
    };
    this.getUsers();
    this.showMore = function (number) {
        if (number > 0) {
            this.limit = number;
            this.showMoreError = false;
            $scope.number = undefined;
        }
        else {
            this.showMoreError = "Please enter a valid number";
        }
        ;
    };
    this.showAll = function () {
        this.limit = undefined;
        this.showMoreError = false;
    };
    this.delete = function (id) {
        this.userId = id;
    };
    this.deleteUser = function () {
        var _this = this;
        this.loading2 = true;
        User.deleteUser(this.userId).then(function (data) {
            if (data.data.success) {
                $timeout(function () {
                    _this.loading2 = false;
                    _this.successMessage = "User succesfully deleted!";
                }, 1000);
                $timeout(function () {
                    _this.successMessage = false;
                    _this.getUsers();
                    if (_this.users.length == 1)
                        $route.reload();
                }, 2000);
            }
            else {
                _this.showMoreError = data.data.message;
            }
            ;
        });
    };
})
    .controller("editController", function ($scope, $routeParams, $timeout, User) {
    var _this = this;
    $scope.nameTab = "active";
    this.phase1 = true;
    this.phase2 = false;
    this.phase3 = false;
    this.phase4 = false;
    this.namePhase = true;
    this.successMessage = false;
    this.errorMessage = false;
    this.disabled = false;
    this.disableUser = false;
    this.disableModerator = false;
    this.disableAdmin = false;
    this.userId = $routeParams["id"];
    var newerName;
    var newUsername;
    var newEmail;
    User.getUser(this.userId).then(function (data) {
        if (data.data.success) {
            $scope.newName = data.data.user.name;
            newerName = data.data.user.name;
            $scope.newUsername = data.data.user.username;
            newUsername = data.data.user.username;
            $scope.newEmail = data.data.user.email;
            newEmail = data.data.user.email;
            $scope.newPermission = data.data.user.permission;
            _this.currentUser = data.data.user._id;
        }
        else {
            _this.errorMessage = data.data.mesasge;
        }
        ;
    });
    this.namePhase = function () {
        $scope.nameTab = "active";
        $scope.usernameTab = "default";
        $scope.emailTab = "default";
        $scope.permissionsTab = "default";
        this.phase1 = true;
        this.phase2 = false;
        this.phase3 = false;
        this.phase4 = false;
    };
    this.usernamePhase = function () {
        $scope.usernameTab = "active";
        $scope.nameTab = "default";
        $scope.emailTab = "default";
        $scope.permissionsTab = "default";
        this.phase2 = true;
        this.phase1 = false;
        this.phase3 = false;
        this.phase4 = false;
    };
    this.emailPhase = function () {
        $scope.emailTab = "active";
        $scope.usernameTab = "default";
        $scope.nameTab = "default";
        $scope.permissionsTab = "default";
        this.phase3 = true;
        this.phase2 = false;
        this.phase1 = false;
        this.phase4 = false;
    };
    this.permissionsPhase = function () {
        $scope.permissionsTab = "active";
        $scope.usernameTab = "default";
        $scope.emailTab = "default";
        $scope.nameTab = "default";
        this.phase4 = true;
        this.phase2 = false;
        this.phase3 = false;
        this.phase1 = false;
        if ($scope.newPermission === "user") {
            this.disableUser = true;
        }
        else if ($scope.newPermission === "moderator") {
            this.disableModerator = true;
        }
        else if ($scope.newPermission === "admin") {
            this.disableAdmin = true;
        }
        ;
    };
    this.updateName = function (newName) {
        var _this = this;
        var userObject = {};
        this.errorMessage = false;
        this.disabled = true;
        userObject["_id"] = this.currentUser;
        userObject["name"] = $scope.newName;
        User.editUser(userObject).then(function (data) {
            if (data.data.success) {
                _this.successMessage = "Name has been updated";
                $timeout(function () {
                    _this.successMessage = false;
                    _this.nameForm.name.$setPristine();
                    _this.nameForm.name.$setUntouched();
                    _this.disabled = false;
                }, 2000);
            }
            else {
                _this.errorMessage = "Please ensure form is filled out";
            }
        });
    };
    this.updateUsername = function (newUsername) {
        var _this = this;
        var userObject = {};
        this.errorMessage = false;
        this.disabled = true;
        userObject["_id"] = this.currentUser;
        userObject["username"] = $scope.newUsername;
        User.editUser(userObject).then(function (data) {
            if (data.data.success) {
                _this.successMessage = "Username has been updated";
                $timeout(function () {
                    _this.successMessage = false;
                    _this.usernameForm.username.$setPristine();
                    _this.usernameForm.username.$setUntouched();
                    _this.disabled = false;
                }, 2000);
            }
            else {
                _this.errorMessage = "Please ensure form is filled out";
            }
            ;
        });
    };
    this.updateEmail = function (newEmail) {
        var _this = this;
        var userObject = {};
        this.errorMessage = false;
        this.disabled = true;
        userObject["_id"] = this.currentUser;
        userObject["email"] = $scope.newEmail;
        User.editUser(userObject).then(function (data) {
            if (data.data.success) {
                _this.successMessage = "Email has been updated";
                $timeout(function () {
                    _this.successMessage = false;
                    _this.emailForm.email.$setPristine();
                    _this.emailForm.email.$setUntouched();
                    _this.disabled = false;
                }, 2000);
            }
            else {
                _this.errorMessage = "Please ensure form is filled out";
            }
            ;
        });
    };
    this.updatePermissions = function (newPermission) {
        var _this = this;
        var userObject = {};
        this.errorMessage = false;
        this.disabled = true;
        userObject["_id"] = this.currentUser;
        userObject["permission"] = newPermission;
        userObject["name"] = newerName;
        User.editUser(userObject).then(function (data) {
            console.log(userObject);
            if (data.data.success) {
                _this.successMessage = "Permissions have been updated";
                $timeout(function () {
                    _this.successMessage = false;
                    if (newPermission === "user") {
                        $scope.newPermission = "user";
                        _this.disableUser = true;
                        _this.disableModerator = false;
                        _this.disableAdmin = false;
                    }
                    else if (newPermission === "moderator") {
                        $scope.newPermission = "moderator";
                        _this.disableModerator = true;
                        _this.disableUser = false;
                        _this.disableAdmin = false;
                    }
                    else if (newPermission === "admin") {
                        $scope.newPermission = "admin";
                        _this.disableAdmin = true;
                        _this.disableModerator = false;
                        _this.disableUser = false;
                    }
                }, 2000);
            }
            else {
                _this.errorMessage = data.data.message;
                $timeout(function () {
                    _this.errorMessage = false;
                }, 4000);
            }
            ;
        });
    };
});
