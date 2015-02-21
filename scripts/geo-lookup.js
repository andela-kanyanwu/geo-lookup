// var geoLookup = {
//   initialize: function() {
//     this.mapLoad();
//   },
//   currLocation: function(result) {
//     function success(position) {
//       var cordinate = position.coords, 
//           latitude = cordinate.latitude,
//           longitude = cordinate.longitude; 
//       return longitude + "," + latitude;
//     };
//     navigator.geolocation.getCurrentPosition(success);
//   },
//   mapLoad: function() {
//     var currentPosition = geoLookup.currLocation();
//     $('#map-canvas').gmap().bind('init', function(ev, map) {
//       $('#map-canvas').gmap({'position': currentPosition, 'bounds': false}).click(function() {
//         $('#map-canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
//       });
//     });
//   },
//   locationEntered: function() {
//   } 
// }

// $(document).ready(geoLookup.mapLoad())

var geoLookup = {
  initialize: function() {
    this.mapLoad();
  },
  currLocation: function() {
    function success(position) {
      var cordinate = position.coords, 
          latitude = cordinate.latitude,
          longitude = cordinate.longitude,
          currPosition = {lat: latitude, lng:  longitude};
          console.log(currPosition);
      return currPosition;
    };
    navigator.geolocation.getCurrentPosition(success);
  },
  mapLoad: function() {
    function initialize() {
      var mapOptions = {
        center:  {lat: 6.5069284, lng: 3.3840723},
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };      
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var marker=new google.maps.Marker({position:mapOptions.center});
      marker.setMap(map);
    }
    google.maps.event.addDomListener(window, 'load', initialize);   
  },
  
  locationEntered: function() {
    var location = $('#textInput').val();
  } 
}

$(document).ready(geoLookup.mapLoad())



