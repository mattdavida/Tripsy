angular.module("tripController", ["myServices"])
    .constant("locationListActiveClass", "btn-primary")
    .constant("locationListPageCount", 3)
    .controller("tripCtrl", function (destinationService, locationListActiveClass, locationListPageCount, $scope, $filter, $timeout, $location, $window, $route) {
    var _this = this;
    var token = $window.localStorage['token'];
    var payload = JSON.parse($window.atob(token.split('.')[1]));
    var selectedLocation = undefined;
    var trip;
    this.trips = destinationService.list(payload._id);
    this.trips.$promise.then(function (data) {
        data.length < 1 ? _this.location = false : _this.location = true;
        trip = data.length;
    });
    this.errorMessage = false;
    this.trip = {};
    this.modalOpen = false;
    this.tripId = null;
    this.successMessage = false;
    this.loading = false;
    this.successMessage2 = false;
    this.loading2 = false;
    this.location = false;
    $scope.selectedPage = 1;
    $scope.pageSize = locationListPageCount;
    this.save = function () {
        var _this = this;
        this.loading2 = true;
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        this.trip.user_tag = payload._id;
        destinationService.save(this.trip).then(function () {
            $timeout(function () {
                _this.loading2 = false;
                _this.successMessage2 = "Trip created!";
            }, 1000);
            $timeout(function () {
                if (trip < 1)
                    $route.reload();
                _this.trips = destinationService.list(payload._id);
                _this.trip = {};
                _this.successMessage2 = false;
            }, 2000);
        }).catch(function (err) {
            _this.loading2 = false;
            _this.errorMessage = err.data.errors;
            $timeout(function () {
                _this.errorMessage = false;
            }, 2000);
        });
    };
    this.remove = function (tripId) {
        var _this = this;
        this.loading = true;
        destinationService.remove(tripId).then(function () {
            $timeout(function () {
                _this.loading = false;
                _this.successMessage = "Trip succesfully deleted!";
            }, 1000);
            $timeout(function () {
                _this.successMessage = false;
                _this.trips = destinationService.list(payload._id);
                _this.trips.$promise.then(function (data) {
                    if (data.length < 1) {
                        _this.location = false;
                        $route.reload();
                    }
                    else {
                        _this.location = true;
                    }
                    ;
                });
            }, 2000);
        }).catch(function (err) {
            console.error(err);
        });
    };
    this.clearForm = function () {
        this.trip = {};
    };
    this.open = function (tripId) {
        this.tripId = tripId;
    };
    $scope.selectLocation = function (newLocation) {
        selectedLocation = newLocation;
        $scope.selectedPage = 1;
    };
    $scope.selectPage = function (newPage) {
        $scope.selectedPage = newPage;
    };
    $scope.locationFilterFn = function (location) {
        return selectedLocation === undefined || location.location === selectedLocation;
    };
    $scope.getLocationClass = function (location) {
        return selectedLocation === location ? locationListActiveClass : "";
    };
    $scope.getPageClass = function (page) {
        return $scope.selectedPage === page ? locationListActiveClass : "";
    };
})
    .controller("tripEditController", function (destinationService, $scope, $routeParams, $location, $timeout) {
    var tripId = $routeParams["id"];
    this.trip = destinationService.get(tripId);
    this.loading = false;
    this.successMessage = false;
    this.cancelMessage = false;
    this.save = function () {
        var _this = this;
        this.loading = true;
        destinationService.save(this.trip).then(function () {
            $timeout(function () {
                _this.loading = false;
                _this.successMessage = "Trip changes saved! Redirecting back to trips...";
            }, 1000);
            $timeout(function () {
                $location.path("/travel");
            }, 2000);
        });
    };
    this.cancel = function () {
        var _this = this;
        this.loading = true;
        $timeout(function () {
            _this.loading = false;
            _this.cancelMessage = "Redirecting back to trips...";
        }, 1000);
        $timeout(function () {
            _this.successMessage = false;
            $location.path("/travel");
        }, 2000);
    };
});
