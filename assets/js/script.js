var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container")
var daysContainerEl = document.querySelector("#days-container");
var citySearchTerm = document.querySelector("#city-search-term");
pastCitiesButtonsEl = document.querySelector("#past-cities-buttons");

var getWeather = function(lat, lon) {
    //format the OpenWeather api url 
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=fb9174eee39da62906652ee7dd116b7c`
    //make a request to the url 
    fetch(apiUrl)
    .then(function(response) {
        // request was successful 
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, city)
            });
        } else {
            alert("Error: location not found!");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to weather app");
    });
};

function initialize(event) {
    event.preventDefault();
    var address = cityInputEl
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    });
}
function codeAddress() {
    geocoder = new google.maps.Geocoder();
    var address = cityInputEl.value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log("Latitude: " + results[0].geometry.location.lat());
            console.log("Longitude: " + results[0].geometry.location.lng());
        }

        else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);