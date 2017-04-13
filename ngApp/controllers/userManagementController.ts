angular.module("userManagementController", [])

.controller("managementController", function(User, $timeout, $scope, $window, $route) {
  this.users;
  this.hasUsers = false;
  this.loading2 = false;
  this.accessDenied = true;
  this.errorMessage = false;
  this.editAccess = false;
  this.deleteAccess = false;
  this.limit;
  this.userId = null;

  this.getUsers = function() {
    User.getUsers().then((data) => {
      let token = window.localStorage['token'];
      let payload = JSON.parse(window.atob(token.split('.')[1]));
      if(data.data.success === true) {
        if(data.data.permission === "admin" || data.data.permission === "moderator") {
            let filter = data.data.users.filter(val => val.username !== payload.username);
            this.users = filter;
            this.accessDenied = false;
            if(this.users < 1) {
              $timeout(() => {
                this.hasUsers = false;
              }, 2000);
            } else {
              this.hasUsers = true;
            }
          if(data.data.permission === "admin") {
            this.editAccess = true;
            this.deleteAccess = true;
          }  else if(data.data.permission === "moderator") {
            this.editAccess = true;
          }
        }  else {
          this.errorMessage = "Insufficient Permissions";
        }
      }  else {
        this.errorMessage = data.data.message;
      };
    });
  };
  this.getUsers();

  this.showMore = function(number) {
    if(number > 0) {
      this.limit = number;
      this.showMoreError = false;
      $scope.number = undefined;
    }  else {
      this.showMoreError = "Please enter a valid number";
    };
  };

  this.showAll = function() {
    this.limit = undefined;
    this.showMoreError = false;
  };

  this.delete = function(id) {
    this.userId = id;
  };

  this.deleteUser = function() {
    this.loading2 = true;
    User.deleteUser(this.userId).then((data) => {
      if(data.data.success) {
        $timeout(() => {
          this.loading2 = false;
          this.successMessage = "User succesfully deleted!";
        }, 1000);
        $timeout(() => {
          this.successMessage = false;
          this.getUsers();
          if(this.users.length == 1) $route.reload();
        }, 2000);
      }  else {
        this.showMoreError = data.data.message;
      };
    });
  };
})

.controller("editController", function($scope, $routeParams, $timeout, User) {

  $scope.nameTab = "active";
  this.phase1 = true; //name
  this.phase2 = false; //username
  this.phase3 = false; //email
  this.phase4 = false; //permissions
  this.namePhase = true;
  this.successMessage = false;
  this.errorMessage = false;
  this.disabled = false;
  this.disableUser = false;
  this.disableModerator = false;
  this.disableAdmin = false;
  this.userId = $routeParams["id"];
  let newerName;
  let newUsername;
  let newEmail;

  User.getUser(this.userId).then((data) => {
    if(data.data.success) {
      $scope.newName = data.data.user.name;
      newerName = data.data.user.name;
      $scope.newUsername = data.data.user.username;
      newUsername = data.data.user.username;
      $scope.newEmail = data.data.user.email;
      newEmail = data.data.user.email;
      $scope.newPermission = data.data.user.permission;
      this.currentUser = data.data.user._id;
    } else {
        this.errorMessage = data.data.mesasge;
    };
  });

  this.namePhase = function() {

      $scope.nameTab = "active";
      $scope.usernameTab = "default";
      $scope.emailTab = "default";
      $scope.permissionsTab = "default";
      this.phase1 = true;
      this.phase2 = false;
      this.phase3 = false;
      this.phase4 = false;
  };

  this.usernamePhase = function() {
      $scope.usernameTab = "active";
      $scope.nameTab = "default";
      $scope.emailTab = "default";
      $scope.permissionsTab = "default";
      this.phase2 = true;
      this.phase1 = false;
      this.phase3 = false;
      this.phase4 = false;
  };

  this.emailPhase = function() {
      $scope.emailTab = "active";
      $scope.usernameTab = "default";
      $scope.nameTab = "default";
      $scope.permissionsTab = "default";
      this.phase3 = true;
      this.phase2 = false;
      this.phase1 = false;
      this.phase4 = false;
  };

  this.permissionsPhase = function() {
      $scope.permissionsTab = "active";
      $scope.usernameTab = "default";
      $scope.emailTab = "default";
      $scope.nameTab = "default";
      this.phase4 = true;
      this.phase2 = false;
      this.phase3 = false;
      this.phase1 = false;

      if($scope.newPermission === "user") {
        this.disableUser = true;
      } else if($scope.newPermission === "moderator") {
          this.disableModerator = true;
      } else if($scope.newPermission === "admin") {
          this.disableAdmin = true
      };
  };

  this.updateName = function(newName) {
    var userObject = {};
    this.errorMessage = false;
    this.disabled = true;


      userObject["_id"] = this.currentUser;
      userObject["name"] = $scope.newName;
  //    console.log(userObject)
      User.editUser(userObject).then((data) => {
        if(data.data.success) {
          this.successMessage = "Name has been updated";
          $timeout(() => {
            this.successMessage = false;
            this.nameForm.name.$setPristine();
            this.nameForm.name.$setUntouched();
            this.disabled = false;
          }, 2000);
        } else {
            this.errorMessage = "Please ensure form is filled out";
        }
      });
  };

  this.updateUsername = function(newUsername) {
    var userObject = {};
    this.errorMessage = false;
    this.disabled = true;


      userObject["_id"] = this.currentUser;
      userObject["username"] = $scope.newUsername;
  //    console.log(userObject)
      User.editUser(userObject).then((data) => {
        if(data.data.success) {
          this.successMessage = "Username has been updated";
          $timeout(() => {
            this.successMessage = false;
            this.usernameForm.username.$setPristine();
            this.usernameForm.username.$setUntouched();
            this.disabled = false;
          }, 2000);
        } else {
            this.errorMessage = "Please ensure form is filled out";
        };
      });
  };

  this.updateEmail = function(newEmail) {
    var userObject = {};
    this.errorMessage = false;
    this.disabled = true;


      userObject["_id"] = this.currentUser;
      userObject["email"] = $scope.newEmail;
    //  console.log(userObject)
      User.editUser(userObject).then((data) => {
        if(data.data.success) {
          this.successMessage = "Email has been updated";
          $timeout(() => {
            this.successMessage = false;
            this.emailForm.email.$setPristine();
            this.emailForm.email.$setUntouched();
            this.disabled = false;
          }, 2000);
        } else {
            this.errorMessage = "Please ensure form is filled out";
        };
      });
  };

  this.updatePermissions = function(newPermission) {
    var userObject = {};
    this.errorMessage = false;
    this.disabled = true;


      userObject["_id"] = this.currentUser;
      userObject["permission"] = newPermission
      userObject["name"] = newerName;


      User.editUser(userObject).then((data) => {
          console.log(userObject)
        if(data.data.success) {
          this.successMessage = "Permissions have been updated";
          $timeout(() => {
            this.successMessage = false;
            if(newPermission === "user") {
              $scope.newPermission = "user";
              this.disableUser = true;
              this.disableModerator = false;
              this.disableAdmin = false;
            } else if(newPermission === "moderator") {
                $scope.newPermission = "moderator";
                this.disableModerator = true;
                this.disableUser = false;
                this.disableAdmin = false;
            } else if(newPermission === "admin") {
                $scope.newPermission = "admin";
                this.disableAdmin = true
                this.disableModerator = false;
                this.disableUser = false;
            }
          }, 2000);
        } else {
            this.errorMessage = data.data.message;
            $timeout(() => {
              this.errorMessage = false;
            }, 4000)
        };
      });
  };
})
