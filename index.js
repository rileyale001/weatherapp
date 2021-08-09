var searchButtonEl = $("#searchButton");
var searchCityEl = $("#searchCity");
var locationEl = $("#location");
var temperatureEl = $("#temperature");
var humidityEl = $("humidity");
var windspeedEl = $("windSpeed");
var uvIndexEl = $("#uvIndex");
// KEY for openweathermap.org
var key = "640d4fd7c24c8e1ea552d91e6c54208a";
var cityLocationName;
//require in moment
var todayDate = moment().format("L");
//could not figure out how to store locally
var storeCity = JSON.parse(localStorage.getItem("searchedCities"))||[];
showSearchedCities(storeCity);
function capFirstLetter(string) {
    // capitalize string of city
    string = string.toLowerCase().split(' ');
    for (var i = 0; i < string.length; i++) {
        string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    }
    return string.join(' ');
}
// add click listener
searchButtonEl.on("click", function () {
    cityLocationName = capFirstLetter(searchCityEl.val());
    $(".hidden").removeClass("hidden");
    if (!storeCity.includes(cityLocationName)) {
        // lists searched city that was stored in local storage
        var listCitiesButton = $("<button>").addClass("btn text-left border border-danger rounded").attr("data-city", storeCity).text(cityLocationName);
        $("#searchCities").prepend(listCitiesButton);
        storeCity.push(cityLocationName);
        saveLocalStorage(storeCity);
        }
        // fetch searched city and call in function for fetch
        getWeatherfetch(cityLocationName);
})
//saves searched cities in string and as JSON
function saveLocalStorage(storeCity) {
    localStorage.setItem("searchCities", JSON.stringify(storeCity));
}
// show searched cities
function showSearchedCities(storeCity) {
    if (storeCity) {
        for (var i = 0; i < storeCity.length; i++) {
            var listCitiesButton = $("<button>").addClass("btn text-left border  border-danger rounded").attr("data-city", storeCity[1]).text(storeCity[i]);
            $("searchCities").prepend(listCitiesButton);
        }
    }
}
// make city a button 
$("#saveCity").on("click", "button", function(){
    var cityButtonClick = $(this).data("location");
    $(".hidden").removeClass("hidden");
    //call in weather fetch for saved city
    getWeatherfetch(cityButtonClick);
})
// fetch with this ajax method to query url
function getWeatherfetch(cityLocationName) {
    var weatherQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityLocationName + "&appid=" + key;
    $.ajax ({
        url: weatherQueryUrl,
        method: "GET",
    }).then(function (response) {
        getCurrentWeather (response);
    })
}
// store values from response to call in later 
function getCurrentWeather (response) {
    var cityVal = response.name;
    var iconVal = $("<img>").attr("src", "https://openweathermap.org/img.wn/" + response.weather[0].icon + ".png").addClass("bg-primary rounded");
    var tempVal = (response.main.temp - 273.15) * 1.8 + 32;
    var humidityVal = response.main.humidity;
    var windSpeedVal = response.wind.speed;

    var latVal = response.coord.lat;
    var lonVal = response.coord.lon;
    locationEl.text((cityVal) + " (" + todayDate + " ) ");
    locationEl.append(iconVal);
    temperatureEl.text("Temperature: " + tempVal.toFixed(1) + " F");
    humidityEl.text("Humidity: " + humidityVal + "%");
    windspeedEl.text("wind speed: " + windSpeedVal);
    // call data for cooridinates of city
    getUvIndexWeather(latVal, lonVal);
    getForecastWeather(latVal, lonVal);
}
// use this function to get uv index
    function getUvIndexWeather(latVal, lonVal) {
        var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latVal + "&lon=" + lonVal + "&appid=" + key;
        $.ajax({
            url: uvQueryUrl,
            method: "GET"
        }).then(function (uvData){
            uvIndexEl.text("UV Index: " + uvData.value);
        });
        }
        // fetch data for forecast 
        function getForecastWeather(latVal, lonVal) {
            var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latVal + "&lon=" + lonVal + "&exclude=minutely,hourly,&appid=" + key;
            $.ajax ({
                url: forecastQueryUrl,
                method: "GET"
            }).then(function (fiveDay) {
                var i = fiveDay.daily.length
                for(var i = 1; i < 6; i++) {
                    $("#date" + [i]).text(moment.unix(fiveDay.daily[i].dt).format("L"));
                    $("#imgDate" + [i]).attr("src", "https://openweathermap.org/img/wn/" + fiveDay.daily[i].weather[0].icon + ".png").addClass("bg-primary rounded");
                    var maxTemp = fiveDay.daily[i].temp.max;
                    var minTemp = fiveDay.daily[i].temp.min;
                    $("#tempDate" + [i]).text(("Temp: ") + ((((maxTemp + minTemp) /2) - 273.15) * 1.8 + 32).toFixed(1));
                    $("#humidityDate" + [i]).text("humidity: " + fiveDay.daily[i].humidity)
                }
            })
        }
    

