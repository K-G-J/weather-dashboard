// selector helpers 
const d=document;
const q=(e,n=d)=>n.querySelector(e);
const qa=(e,n=d)=>n.querySelectorAll(e);

// html elements
const cityFormEl = q("#city-form")
const cityInputEl = q("#cityname");
const cityContainerEl = q("#city-container")
const daysContainerEl = q("#days-container");
const citySearchTerm = q("#city-search-term");
const pastCitiesButtonsEl = q("#past-cities-buttons");
const searchBtn=q('#getCords');
const ulSearches=q('#recent');

// get current date 
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const date = new Date();
let month = months[date.getMonth()];
let day = date.getDate()
let currentDate = `${month}, ${day}`

var getWeather = function(lat,lon,city) {
    daysContainerEl.innerHTML = "";
    //format the OpenWeather api url 
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=fb9174eee39da62906652ee7dd116b7c`
    var currentCity = city
    console.log(currentCity)
    //make a request to the url 
    fetch(apiUrl)
    .then(function(response) {
         // request was successful 
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data)
            displayWeather(data, currentCity)
        });
    } else {
        alert("Error: location not found!");
    }
})
.catch(function(error) {
    alert("Unable to connect to weather app");
    });
};
var initialize = function(event) {
    event.preventDefault();
    var address = cityInputEl
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, "place_changed", function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
        return;
    }
    var address = "";
    if (place.address_components) {
        address = [
            (place.address_components[0] && place.address_components[0].short_name || ""),
            (place.address_components[1] && place.address_components[1].short_name || ""),
            (place.address_components[2] && place.address_components[2].short_name || "")
        ].join(" ");
    }
});
}
var codeAddress = function() {
    geocoder = new google.maps.Geocoder();
    var city = cityInputEl.value;
    geocoder.geocode({
        'address': city
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            getWeather(lat,lon,city);
            // function call to create past city buttons 
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });
}
var displayWeather = function (data, currentCity) {
    // current forecast element 
    citySearchTerm.textContent = `${currentCity}, ${currentDate}`
    q("#current-icon").innerHTML = `<img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png' >`
    q("#current-temp").textContent = `Temp: ${data.current.temp}°F`
    q("#current-wind").textContent = `Wind: ${data.current.wind_speed} MPH`
    q("#current-humidity").textContent = `Humidity: ${data.current.humidity}%`
    let uviEl = q("#current-uvi")
    let uvi = Math.round(data.current.uvi)
    uviEl.textContent = `UVI: ${data.current.uvi}`
    if (uvi <= 2){
        uviEl.style.backgroundColor = "green"
    } else if (uvi >= 3 && uvi <= 5){
        uviEl.style.backgroundColor = "yellow"
    } else if (uvi >= 6 && uvi <= 7) {
        uviEl.style.backgroundColor = "orange"
    } else if (uvi >= 8 && uvi <= 10) {
        uviEl.style.backgroundColor = "red"
    } else if (uvi >= 11) {
        uviEl.style.backgroundColor = "magenta"
    }
    
    // 5 day forecast subtitle 
    var fiveDaysubtitle = document.createElement("h2")
    fiveDaysubtitle.textContent = "5-Day Forecast"
    fiveDaysubtitle.className = "subtitle"
    fiveDaysubtitle.id = "5-day-forcast"
    daysContainerEl.appendChild(fiveDaysubtitle);
    // day cards wrapper div 
    var dayCardWrapper = document.createElement("div")
    dayCardWrapper.className = "day-card-wrapper"
    daysContainerEl.appendChild(dayCardWrapper);
    
    // day 1 
    var day1Header = document.createElement("h3")
    day1Header.textContent = `${month}, ${day + 1}`
    day1Header.className = "card-header text-uppercase"
    dayCardWrapper.appendChild(day1Header);
    var day1Card = document.createElement("div")
    day1Card.className = "day-card-body"
    day1Header.appendChild(day1Card)
    // weather icon image 
    var weatherIcon1 = document.createElement("p")
    weatherIcon1.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}@2x.png' >`
    day1Card.appendChild(weatherIcon1)
    // temp
    var day1Temp = document.createElement("p")
    day1Temp.textContent = `Temp: ${data.daily[1].temp.day}°F`
    day1Card.appendChild(day1Temp)
    // wind 
    var day1Wind = document.createElement("p")
    day1Wind.textContent = `Wind: ${data.daily[1].wind_speed} MPH` 
    day1Card.appendChild(day1Wind)
    // humidity 
    var day1Humidity = document.createElement("p")
    day1Humidity.textContent = `Humidity: ${data.daily[1].humidity}%`
    day1Card.appendChild(day1Humidity)
    
    // day 2
    var day2Header = document.createElement("h3")
    day2Header.textContent = `${month}, ${day + 2}`
    day2Header.className = "card-header text-uppercase"
    dayCardWrapper.appendChild(day2Header);
    var day2Card = document.createElement("div")
    day2Card.className = "day-card-body"
    day2Header.appendChild(day2Card)
    // weather icon image 
    var weatherIcon2 = document.createElement("p")
    weatherIcon2.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[2].weather[0].icon}@2x.png' >`
    day2Card.appendChild(weatherIcon2)
    // temp
    var day2Temp = document.createElement("p")
    day2Temp.textContent = `Temp: ${data.daily[2].temp.day}°F`
    day2Card.appendChild(day2Temp)
    // wind 
    var day2Wind = document.createElement("p")
    day2Wind.textContent = `Wind: ${data.daily[2].wind_speed} MPH` 
    day2Card.appendChild(day2Wind)
    // humidity 
    var day2Humidity = document.createElement("p")
    day2Humidity.textContent = `Humidity: ${data.daily[2].humidity}%`
    day2Card.appendChild(day2Humidity)

    // day 3
    var day3Header = document.createElement("h3")
    day3Header.textContent = `${month}, ${day + 3}`
    day3Header.className = "card-header text-uppercase"
    dayCardWrapper.appendChild(day3Header);
    var day3Card = document.createElement("div")
    day3Card.className = "day-card-body"
    day3Header.appendChild(day3Card)
    // weather icon image 
    var weatherIcon3 = document.createElement("p")
    weatherIcon3.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[3].weather[0].icon}@2x.png' >`
    day3Card.appendChild(weatherIcon3)
    // temp
    var day3Temp = document.createElement("p")
    day3Temp.textContent = `Temp: ${data.daily[3].temp.day}°F`
    day3Card.appendChild(day3Temp)
    // wind 
    var day3Wind = document.createElement("p")
    day3Wind.textContent = `Wind: ${data.daily[3].wind_speed} MPH` 
    day3Card.appendChild(day3Wind)
    // humidity 
    var day3Humidity = document.createElement("p")
    day3Humidity.textContent = `Humidity: ${data.daily[3].humidity}%`
    day3Card.appendChild(day3Humidity)

    // day 4 
    var day4Header = document.createElement("h3")
    day4Header.textContent = `${month}, ${day + 4}`
    day4Header.className = "card-header text-uppercase"
    dayCardWrapper.appendChild(day4Header);
    var day4Card = document.createElement("div")
    day4Card.className = "day-card-body"
    day4Header.appendChild(day4Card)
    // weather icon image 
    var weatherIcon4 = document.createElement("p")
    weatherIcon4.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[4].weather[0].icon}@2x.png' >`
    day4Card.appendChild(weatherIcon4)
    // temp
    var day4Temp = document.createElement("p")
    day4Temp.textContent = `Temp: ${data.daily[4].temp.day}°F`
    day4Card.appendChild(day4Temp)
    // wind 
    var day4Wind = document.createElement("p")
    day4Wind.textContent = `Wind: ${data.daily[4].wind_speed} MPH` 
    day4Card.appendChild(day4Wind)
    // humidity 
    var day4Humidity = document.createElement("p")
    day4Humidity.textContent = `Humidity: ${data.daily[4].humidity}%`
    day4Card.appendChild(day4Humidity)

      // day 5
      var day5Header = document.createElement("h3")
      day5Header.textContent = `${month}, ${day + 5}`
      day5Header.className = "card-header text-uppercase"
      dayCardWrapper.appendChild(day5Header);
      var day5Card = document.createElement("div")
      day5Card.className = "day-card-body"
      day5Header.appendChild(day5Card)
      // weather icon image 
      var weatherIcon5 = document.createElement("p")
      weatherIcon5.innerHTML = `<img src='http://openweathermap.org/img/wn/${data.daily[5].weather[0].icon}@2x.png' >`
      day5Card.appendChild(weatherIcon5)
      // temp
      var day5Temp = document.createElement("p")
      day5Temp.textContent = `Temp: ${data.daily[5].temp.day}°F`
      day5Card.appendChild(day5Temp)
      // wind 
      var day5Wind = document.createElement("p")
      day5Wind.textContent = `Wind: ${data.daily[5].wind_speed} MPH` 
      day5Card.appendChild(day5Wind)
      // humidity 
      var day5Humidity = document.createElement("p")
      day5Humidity.textContent = `Humidity: ${data.daily[5].humidity}%`
      day5Card.appendChild(day5Humidity)
}

// event listeners 
google.maps.event.addDomListener(window, "load", initialize);
searchBtn.addEventListener("click", codeAddress)