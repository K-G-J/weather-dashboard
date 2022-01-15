var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityname");
var cityContainerEl = document.querySelector("#city-container")
var daysContainerEl = document.querySelector("#days-container");
var citySearchTerm = document.querySelector("#city-search-term");
pastCitiesButtonsEl = document.querySelector("#past-cities-buttons");

var getWeather = function(cityname) {
    //format the OpenWeather api url 
    var apiUrl = (`api.openweathermap.org/data/2.5/forecast?q=${cityname}&units=imperial&appid=fb9174eee39da62906652ee7dd116b7c`.split("_").pop())
    //http://127.0.0.1:5500/
    
    //make a request to the url 
    fetch(apiUrl)
    .then(function(response) {
        // request was successful 
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                // displayWeather(data, city)
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
            var cityname = (place.address_components[0] && place.address_components[0].short_name || '').split(" ").join("")
            console.log(cityname);
            getWeather(cityname);
        }
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
