var map;
var currentPos = [];
var infoWindow;
var geomarker;
var locations;
var markers = [];
var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var GeoMarker
function initMap() {
  console.log("initiating map");
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
  //infoWindow = new google.maps.InfoWindow({map: map});
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
      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Current Location');
      var myloc = new google.maps.Marker({
          clickable: false,
          icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                          new google.maps.Size(22,22),
                                                          new google.maps.Point(0,18),
                                                          new google.maps.Point(11,11)),
          shadow: null,
          zIndex: 999,
          map: map
      });
      myloc.setPosition(pos);
      //geomarker = new GeolocationMarker(map);
      map.setCenter(pos);
      GeoMarker = new GeolocationMarker(map);
      console.log("Map set");
      //getLocations();
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("");
    handleLocationError(false, infoWindow, map.getCenter());
  }
  getLocations();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  console.log("Location failed");
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  }

function getLocations() {
  console.log("getting locations");
  var xhr = new XMLHttpRequest();
  var rootweb = "http://" + window.location.hostname + ":" + window.location.port + "/api/profiles";
  var profiles;

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log("hello");
      profiles = JSON.parse(xhr.responseText);
      //console.log(profiles);
      locations = profiles;
      setMarkers();
    }
  }
  //alert(rootweb);
  xhr.open('GET', rootweb , true);
  xhr.send(null);

}

function setMarkers() {
  var latlng;
  var infoOutput = "";
  for (var p = 0 ; p < locations.length && p < labels.length ; p++) {
    var mark = locations[p];
    latlng = {lat: parseFloat(mark.location.lat), lng: parseFloat(mark.location.lng)};
    console.log(latlng);
    console.log(labels.charAt(p), typeof labels.charAt(p));
    var marker = new google.maps.Marker({
        position: latlng,
        title: mark.name,
        icon: "http://maps.google.com/mapfiles/marker" + labels.charAt(p) + ".png"
    });
    marker.setMap(map);
    markers.push(marker);
    infoOutput += setoutput(mark, p);
  }
  console.log("````````");
  document.getElementById('displayInfo').innerHTML = infoOutput;
}

function setoutput(mark, index) {
  console.log(mark.location);
  var address = "<h4>" + mark.location.streetnumber + " " + mark.location.street + "</h4><p>" + mark.location.city + ", " + mark.location.country + "</p>";
  var title = "<div><h2 class=\"innerTitle\">" + labels.charAt(index) + "</h2>" + "<h3 class=\"innerTitle\">" + mark.name + "</h3></div>";
  return "<div class=\"innerInfo\" onclick=\"highlightMarker(this.innerHTML)\">" + title + address + "</div>";
}

function highlightMarker(contents) {
  console.log("clicked");
  stopCurrentAnimations();
  var index = labels.indexOf(contents.charAt(contents.indexOf("</h2>") -1));
  var selected = markers[index];
  selected.setAnimation(google.maps.Animation.BOUNCE);
}

function stopCurrentAnimations() {
  for (var i = 0 ; i < markers.length ; i ++) {
    markers[i].setAnimation(null);
  }
}
