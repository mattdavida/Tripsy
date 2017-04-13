angular.module("myServices", [])

.service("destinationService", function($resource) {
  this.destinationService = $resource("/trips/:id");
  this.destinationEditService = $resource("/tripEdit/:id");


  this.get = function(id) {
    return this.destinationEditService.get({id: id});
  };

  this.list = function(id) {
    return this.destinationService.query({id: id})
  };

 this.save = function(trip) {
  return this.destinationService.save({id:trip._id}, trip).$promise;
};

 this.remove = function(tripId) {
   return this.destinationService.remove({id:tripId}).$promise;
 };

});
