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
    this.currLocation();
    this.locationEntered();
  },

  //Gets current location of user
  currLocation: function() {
    function success(position) {
      console.log(position);
      var coords = position.coords;
      geoLookup.mapLoad(coords.latitude, coords.longitude);
      return coords;
    };
    navigator.geolocation.getCurrentPosition(success);
  },

  //Loads map with default location
  mapLoad: function(lat, lng) {
    function initialize() {
      var mapOptions = {
        center:  {lat: lat, lng: lng},
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var marker=new google.maps.Marker({position:mapOptions.center});
      marker.setMap(map);
    }
    google.maps.event.addDomListener(window, 'load', initialize());   
  },

  //concatenates url with user's input
  url: function(){
    var location = $('#textInput').val().trim(),
        url = "http://api.openweathermap.org/data/2.5/weather?",
        fullUrl = url + "q=" + location;
        console.log("full URL: ", fullUrl);
    return fullUrl;

  },

  //Gets user's location
  locationEntered: function() {
    $("#search").click(function(event){
      event.preventDefault();
      console.log("clicked");
      geoLookup.weatherMap();     
    });        
  },

  //Calls weather api using location entered and sets map's location 
  weatherMap: function() {
    var url = geoLookup.url();
    console.log(url);

    $.getJSON(url, function(reply){
      console.log(reply);
      var newLatitude = reply.coord.lat,
          newLongitude = reply.coord.lon,
          newLocation = {lat: newLatitude, lng:  newLongitude};

      console.log("New location: ", newLocation);

      //set map's view with current location entered 
      geoLookup.mapLoad(newLatitude, newLongitude);  

      //Get weather details according to location
      
    }); 
  }
  
}

$(document).ready(geoLookup.initialize())



