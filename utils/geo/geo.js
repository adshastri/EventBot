const settings = require('../secret.json');
var googleMaps = require('@google/maps')
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
        console.log(response.json.results[0].geometry.location);
        currentLocation = {
          lat: parseFloat(response.json.results[0].geometry.location.lat),
          lng: parseFloat(response.json.results[0].geometry.location.lng),
        }
        callback(null, currentLocation);
      } else if (err) {
        console.log(err);
        callback(new Error("google maps error"), null);
      } else {
        console.log(response.status);
        callback(new Error("maps succeeded, status not OK"), {status: response.status});
      }
    });

  }
}
