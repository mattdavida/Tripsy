var myapp;
(function (myapp) {
    angular.module("myapp", ["appRoutes", "userControllers", "userServices", "ngAnimate", "mainController", "authServices", "userManagementController",
        "ngResource", "myServices", "tripController", "customFilters"])
        .config(function ($httpProvider) {
        $httpProvider.interceptors.push("AuthInterceptors");
    });
})(myapp || (myapp = {}));
