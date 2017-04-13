angular.module("userServices", [])
    .factory("User", function ($http) {
    this.userFactory = {};
    this.userFactory.create = function (regData) {
        return $http.post("/api/users", regData);
    };
    this.userFactory.getPermission = function () {
        return $http.get("/api/users/permission");
    };
    this.userFactory.getUsers = function () {
        return $http.get("/api/users/management");
    };
    this.userFactory.getUser = function (id) {
        return $http.get("/api/users/edit/" + id);
    };
    this.userFactory.deleteUser = function (username) {
        return $http.delete("/api/users/management/" + username);
    };
    this.userFactory.editUser = function (id) {
        return $http.put("/api/users/edit", id);
    };
    return this.userFactory;
});
