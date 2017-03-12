const settings = require('../secret.json');
var busPoints = require('./data/stops');
var googleMaps = require('@google/maps');
var googleMapsClient = googleMaps.createClient({
  key: settings.GOOGLE_MAPS_API_KEY,
});

module.exports = {
  coords: function(name, callback){
    googleMapsClient.geocode({
      address: name,
      bounds: {south: 40.474369, west: -74.495217, north: 40.547717, east:-74.405550},
    }, function(err, response){
      if (!err && response.status == '200'){
        callback(null, response.json.results[0].geometry.location);
      } else if (err) {
        console.log(err);
        callback(new Error("google maps error"), null);
      } else {
        console.log(response.status);
        callback(new Error("maps succeeded, status not OK"), {status: response.status});
      }
    });
  },
  stops: function(from, to, callback){
    var result = {
      to: {
        stop: '',
        time: '',
      },
      from: {
        stop: '',
        time: '',
      }
    }
    googleMapsClient.distanceMatrix({
      origins: [from],
      destinations: busPoints.campusPoints,
      mode: 'walking',
    }, function(err, response){
        if (!err){
          closestStopInfo(response, function(info){
            result.to.stop = info.name;
            result.to.time = info.duration;
            console.log(result);
          });
        } else {
          console.log(err);
        }
    });
    googleMapsClient.distanceMatrix({
      origins: [to],
      destinations: busPoints.campusPoints,
      mode: 'walking',
    }, function(err, response){
        if (!err){
          closestStopInfo(response, function(info){
            result.from.stop = info.name;
            result.from.time = info.duration;
            console.log(result);
          });
        } else {
          console.log(err);
        }
    });
  }
}

function closestStopInfo(response, callback){
  var origins = response.json.origin_addresses;
  var destinations = response.json.destination_addresses;
  var minDist = 10000000;
  var result = response.json.rows[0].elements;

  var closestLeavingCampusPoint;
  var campus;
  var minIndex;
  for (var j = 0; j < result.length; j++) {
    var distance = result[j].distance.value;
    if (distance < minDist) {
      minDist = distance;
      minIndex = j;
      closestLeavingCampusPoint = destinations[j];
    }
  }

  if (minIndex == 0){
  	campus = busPoints.collegeave;
  } else if (minIndex == 1) {
  	campus = busPoints.busch;
  } else if (minIndex==2) {
   	campus = busPoints.livingston;
  } else if (minIndex == 3){
  	campus = busPoints.douglass;
  } else {
  	campus = busPoints.cook;
  }

  googleMapsClient.distanceMatrix({
      origins: [origins[0]],
      destinations: campus,
      mode: 'walking',
    }, function(err, response) {
    	if (response.status == '200') {
        var origins2 = response.json.origin_addresses;
        var destinations2 = response.json.destination_addresses;
        var minDist = 10000000;
        var result = response.json.rows[0].elements;
        var closestLeavingBusStop;
        var closestLeavingBusStopName;
        var minIndex;
        for (var k = 0; k < result.length; k++) {
          var distance = result[k].distance.value;
          if (distance < minDist) {
            minDist = distance;
            minIndex = k;
          }
        }
        closestLeavingBusStop = campus[minIndex];
        //returnValue += busPoints.codes[busPoints.stops.indexOf(closestLeavingBusStop)];
        closestLeavingBusStopName = busPoints.names[busPoints.stops.indexOf(closestLeavingBusStop)];
        callback({name: closestLeavingBusStopName, duration: result[minIndex].duration});
    } else {
      console.log(response.status);
      console.log("Could not find nearest campus.");
  	}
 });
}
