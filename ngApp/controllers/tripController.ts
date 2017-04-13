angular.module("tripController", ["myServices"])
.constant("locationListActiveClass", "btn-primary")
.constant("locationListPageCount", 3)
.controller("tripCtrl", function(destinationService, locationListActiveClass, locationListPageCount, $scope, $filter, $timeout, $location, $window, $route) {
  let token = $window.localStorage['token'];
  let payload = JSON.parse($window.atob(token.split('.')[1]));
  let selectedLocation = undefined;
  let trip;

  this.trips = destinationService.list(payload._id);
  this.trips.$promise.then((data) => {
    data.length < 1 ? this.location = false : this.location = true;
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

  this.save = function() {
    this.loading2 = true;
    let payload = JSON.parse($window.atob(token.split('.')[1]));
    this.trip.user_tag = payload._id;
    destinationService.save(this.trip).then(() => {
        $timeout(() => {
          this.loading2 = false;
          this.successMessage2 = "Trip created!";
        }, 1000);
        $timeout(() => {
          if(trip < 1) $route.reload();
          this.trips = destinationService.list(payload._id);
          this.trip = {};
          this.successMessage2 = false;
        }, 2000)
    }).catch((err) => {
      this.loading2 = false;
      this.errorMessage = err.data.errors;
      $timeout(() => {
        this.errorMessage = false;
      }, 2000);
    });
  };

  this.remove = function(tripId) {
    this.loading = true;
    destinationService.remove(tripId).then(() => {
      $timeout(() => {
        this.loading = false;
        this.successMessage = "Trip succesfully deleted!";
      }, 1000);
      $timeout(() => {
        this.successMessage = false;
        this.trips = destinationService.list(payload._id); // redisplay list
        this.trips.$promise.then((data) => {
          if(data.length < 1) {
            this.location = false;
            $route.reload();
          } else {
            this.location = true;
          };
        });
      }, 2000);
    }).catch((err) => {
      console.error(err);
    });
  };

  this.clearForm = function() {
    this.trip = {};
  };

  this.open = function(tripId) {
    this.tripId = tripId;
  };

  $scope.selectLocation = function(newLocation) {
    selectedLocation = newLocation;
    $scope.selectedPage = 1;
  };

  $scope.selectPage = function(newPage) {
    $scope.selectedPage = newPage;
  };

  $scope.locationFilterFn = function(location) {
    return selectedLocation === undefined || location.location === selectedLocation;
  };

  $scope.getLocationClass = function(location) {
    return selectedLocation === location ? locationListActiveClass : "";
  };

  $scope.getPageClass = function(page) {
    return $scope.selectedPage === page ? locationListActiveClass : "";
  };
})

.controller("tripEditController", function(destinationService, $scope, $routeParams, $location, $timeout) {
  let tripId = $routeParams["id"];
  this.trip = destinationService.get(tripId);
  this.loading = false;
  this.successMessage = false;
  this.cancelMessage = false;

  this.save = function() {
    this.loading = true;
    destinationService.save(this.trip).then(() => {
      $timeout(() => {
        this.loading = false;
        this.successMessage = "Trip changes saved! Redirecting back to trips...";
      }, 1000);
      $timeout(() => {
        $location.path("/travel");
      }, 2000);
    });
  };

  this.cancel = function() {
    this.loading = true;
    $timeout(() => {
      this.loading = false;
      this.cancelMessage = "Redirecting back to trips...";
    }, 1000);
    $timeout(() => {
      this.successMessage = false;
      $location.path("/travel");
    }, 2000);
  };
});
