var geoLookup = {
  initialize: function() {
    this.currLocation();
    this.locationEntered();
    $("#error").hide();
    $("#weather-map").show();
  },

  //Gets current location of user
  currLocation: function() {
    function success(position) {
      var coords = position.coords;
      geoLookup.mapLoad(coords.latitude, coords.longitude);
      var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + coords.latitude + "&lon=" + coords.longitude;

      //Call the weather api using the user's current location
      $.getJSON(url, function(reply){ 

        //Error message
        if (reply.message === "Error: Not found city") {
          $("#weather-map").hide(); 
          $("#error").show();        
          $("#error").html("<h2>" + "City not found" + "</h2>");
        }

        //convert temperature to celsius by subtracting 273.15 as results is given in Kelvin
          var tempCelsius = geoLookup.convertKelvinToCelsius(reply.main.temp),
              country = reply.sys.country,
              weatherDescription = reply.weather[0].description,
              icon = reply.weather[0].icon,
              iconUrl = "http://openweathermap.org/img/w/" + icon + ".png",
              latitude = coords.latitude.toFixed(2),
              longitude = coords.longitude.toFixed(2);

          $("#error").hide();
          $("#weather-map").show();
          $("#icon").html("<img src=" + iconUrl + ">").show();
          $("#weather").html(weatherDescription).show();
          $("#temp").html(tempCelsius + '&deg' + "C").show();
          $("#country").html(country).show();
          $("#position").html("lat: " + latitude + "  lng: " + longitude).show();
      }).fail(function(error){
        if (error.statusText === "error") {
          $("#error").html("An error occurred.");
        }
      });
      
      //call the weather's API using current location to get forecast for the week
      var wkUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + coords.latitude + "&lon=" + coords.longitude + "&cnt=7";

      $.getJSON(wkUrl, function(reply){

        for (var i = 1; i < (reply.list).length; i++) {
          //converts the date given in unix timestamp to readable date
          var date = geoLookup.convertUnixTimeToDate(reply.list[i].dt),
              tempCelsius = geoLookup.convertKelvinToCelsius(reply.list[i].temp.day),
              description = reply.list[i].weather[0].description,
              icon = reply.list[i].weather[0].icon,
              iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

          console.log("date: ", date);
          console.log("temperature: ", tempCelsius);
          console.log("description: ", reply.list[i].weather[0].description);
          console.log("icon: ", reply.list[i].weather[0].icon);

          

        // $("#weekly-date").append(date).show();
        // $("#weekly-icon").append("<img src=" + iconUrl + ">").show();
        // $("#weekly-temp").append(tempCelsius + "&deg" + "C").show();
        // $("#weekly-description").append(description).show();
        }     
      });
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
    return fullUrl;
  },

  //Gets user's location
  locationEntered: function() {
    $("#search").click(function(event){
      event.preventDefault();      
      geoLookup.weatherMap();
      //$("#textInput").val('');     
    }); 
    $(document).on("keypress", "#textInput", function(e) {
        if(e.which == 13) {
          $('#search').trigger('click');
        }
    });       
  },

  //Calls weather api using location entered and sets map's location 
  weatherMap: function() {
    var url = geoLookup.url();

    $.getJSON(url, function(reply){

      //Error message
      if (reply.message === "Error: Not found city") {
        $("#weather-map").hide();          
        $("#error").show(); 
        $("#error").html("<h2>" + "City not found" + "</h2>");
      } 
      else {
        var newLatitude = reply.coord.lat,
          newLongitude = reply.coord.lon,
          newLocation = {lat: newLatitude, lng:  newLongitude};

        //set map's view with current location entered 
        geoLookup.mapLoad(newLatitude, newLongitude);  

        //Get weather details according to location
        //convert temperature to celsius by subtracting 273.15 as results is given in Kelvin
        var tempCelsius = geoLookup.convertKelvinToCelsius(reply.main.temp),
            country = reply.sys.country,
            weatherDescription = reply.weather[0].description,
            icon = reply.weather[0].icon,
            iconUrl = "http://openweathermap.org/img/w/" + icon + ".png",
            latitude = newLatitude.toFixed(2),
            longitude = newLongitude.toFixed(2);

        $("#error").hide();
        $("#weather-map").show();
        $("#icon").html("<img src=" + iconUrl + ">").show();
        $("#weather").html(weatherDescription).show();
        $("#temp").html(tempCelsius + '&deg' + "C").show();
        $("#country").html(country).show();
        $("#position").html("lat: " + latitude + "  lng: " + longitude).show();
      }      
    }).fail(function(error){
        if (error.statusText === "error") {
          $("#error").html("An error occurred.");
        }
    }); 
  },

  //function to convert time from unix timestamp to readable date
  convertUnixTimeToDate: function(unixTime) {
    var milliseconds = unixTime * 1000,
        date = new Date(milliseconds).toDateString();
    return date;
  },

  //function to convert temperature given in kelvin to celsius
  convertKelvinToCelsius: function(kelvin) {
    var celsius = (kelvin - 273.15).toFixed(2);
    return celsius;
  }
  
}

$(document).ready(geoLookup.initialize())



