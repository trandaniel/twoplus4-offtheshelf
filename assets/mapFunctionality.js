var map;
var currentPos = [];
var infoWindow;

function initMap() {
  console.log("initiating map");
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow({map: map});
  geocoder = new google.maps.Geocoder;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      currentPos.push(position.coords.latitude);
      currentPos.push(position.coords.longitude);
      infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      map.setCenter(pos);
      console.log("Map set");
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  console.log("Location failed");
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  }