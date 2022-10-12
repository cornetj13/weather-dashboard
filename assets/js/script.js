var APIKey          = "5bdf324775e0896ec3053c8ff5073cc3";
var previousCities  = [];

var cityFormEl        = document.querySelector('#city-form');
var cityInputEl       = document.querySelector('#city');
var cityButtonsEl     = document.querySelector('#cities-container');
var cityJumbotronEl   = document.querySelector('#city-jumbotron');

var previousCitiesEl  = document.querySelector('#cities-container');

var cityHeader        = document.querySelector('#jumbo-header');
var cityDescription   = document.querySelector('#jumbo-description');
var cityIcon          = document.querySelector('#jumbo-icon');
var cityTemp          = document.querySelector('#jumbo-temp');
var cityWind          = document.querySelector('#jumbo-wind');
var cityHumidity      = document.querySelector('#jumbo-humidity');

cityHeader.textContent      = '';
cityDescription.textContent = '';
cityTemp.textContent        = '';
cityWind.textContent        = '';
cityHumidity.textContent    = '';

var getFromStorage = function () {
  var storedCities = JSON.parse(localStorage.getItem("cities"));
  console.log(storedCities);
  if (storedCities !== null) {
    for (let i = 0; i < storedCities.length; i++) {
      const city = storedCities[i];
      createCityButton(city);
    }
  }
}

var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = cityInputEl.value.trim();

  if (cityName) {
    if(!previousCities.includes(cityName)) {
      previousCities.push(cityName);
      createCityButton(cityName);
      addToStorage(previousCities);
    }
    getWeatherInfo(cityName);
    getForecastInfo(cityName);
    
    cityInputEl.value = '';
  } else {
    alert('Please enter a city.');
  }
};

var createCityButton = function (city) {
  var cityButton = document.createElement('button');
  cityButton.classList = 'btn';
  cityButton.setAttribute("city-name", city);
  cityButton.textContent = city;
  cityButtonsEl.appendChild(cityButton);
}

var addToStorage = function (previousCities) {
  var citiesToStore = JSON.stringify(previousCities);
  localStorage.setItem("cities", citiesToStore);
}

var getWeatherInfo = function (city) {
  var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

  fetch(apiURL)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayData(data, city);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect to current weather API.');
  });
}

var getForecastInfo = function (city) {
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

  fetch(forecastURL)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayForecast(data, city);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect to forecast API.');
  });
}

var displayData = function (weatherData, cityName) {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var tempKelvin = weatherData.main.temp;
  var tempFahrenheit = 1.8 * (tempKelvin - 273) + 32;
  var weatherDescription = weatherData.weather[0].description;
  // var weatherIcon = weatherData.weather[0].icon;
  var windSpeedMPS = weatherData.wind.speed;
  var windSpeedMPH = windSpeedMPS * 2.23694;
  var humidityPercentage = weatherData.main.humidity;

  cityHeader.textContent = cityName + " (" + month + "/" + day + "/" + year + ")";
  // cityIcon.src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  // cityIcon.classList.remove("hidden");
  // cityIcon.classList.add("show");
  cityDescription.textContent = weatherDescription;
  cityTemp.textContent = "Temp: " + tempFahrenheit.toFixed(2) + " deg F";
  cityWind.textContent = "Wind: " + windSpeedMPH.toFixed(2) + " MPH";
  cityHumidity.textContent = "Humidity: " + humidityPercentage + "%";
}

var displayForecast = function (forecastData, cityName) {
  var today = new Date();
  for (let i = 0; i < 5; i++) {
    idValue = i + 1
    var forecastDate = document.querySelector('#forecast-header-' + idValue);
    var forecastDescription = document.querySelector('#forecast-description-' + idValue);
    // var forecastIcon = document.querySelector('#forecast-icon-' + idValue);
    var forecastTemp = document.querySelector('#forecast-temp-' + idValue);
    var forecastWind = document.querySelector('#forecast-wind-' + idValue);
    var forecastHumidity = document.querySelector('#forecast-humidity-' + idValue);

    const forecastDay = new Date(today);
    forecastDay.setDate(forecastDay.getDate() + i + 1);
    var year = forecastDay.getFullYear();
    var month = forecastDay.getMonth();
    var day = forecastDay.getDate();
    var tempKelvin = forecastData.list[(i * 7) + 5].main.temp;
    var tempFahrenheit = 1.8 * (tempKelvin - 273) + 32;
    var weatherDescription = forecastData.list[(i * 7) + 5].weather[0].description;
    var windSpeedMPS = forecastData.list[(i * 7) + 5].wind.speed;
    var windSpeedMPH = windSpeedMPS * 2.23694; 
    var humidityPercentage = forecastData.list[(i * 7) + 5].main.humidity;

    forecastDate.textContent = "(" + month + "/" + day + "/" + year + ")";
    forecastDescription.textContent = weatherDescription
    // forecastIcon.textContent = weatherIcon
    forecastTemp.textContent = "Temp: " + tempFahrenheit.toFixed(2) + " deg F";
    forecastWind.textContent = "Wind: " + windSpeedMPH.toFixed(2) + " MPH";
    forecastHumidity.textContent = "Humidity: " + humidityPercentage + "%";
  }
}

var buttonClickHandler = function (event) {
  var cityName = event.target.getAttribute('city-name');

  if(cityName) {
    getWeatherInfo(cityName);
    getForecastInfo(cityName);
  }
}

getFromStorage();
cityFormEl.addEventListener('submit', formSubmitHandler)
previousCitiesEl.addEventListener('click', buttonClickHandler)

// TODO: Cleanup HTML and CSS