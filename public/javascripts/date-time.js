
const apiKey = "a784c28c1c20f9576703dc8f10f56fa7" 

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// Function that define the local date  for the user current location. format Day DD/MM/YYYY
function currentDate() {
  let nowDate = new Date();
  let day = nowDate.getDay();
  let date = nowDate.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  let month = nowDate.getMonth();
  let months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  month = months[nowDate.getMonth()];
  day = weekDays[nowDate.getDay()];
  let formatDate = `${day} ${date}/${month}/${nowDate.getFullYear()}`;
  return formatDate;
}

// Function that update the information from the main city use  to define the information of the user current location or the user selection. 

function updateMainCity(response) {
  document.querySelector("#current-city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp;
  document.querySelector(".actual-temp").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  let icon = response.data.weather[0].icon;
  let currentWeatherIcon = document.querySelector("#icon-current");
  currentWeatherIcon.innerHTML = ` <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Cweather">`

  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  createForecastUrl(latitude, longitude);  //  API url for the  forecast requeries these parameters. 
}

// function that receive the parameters of longitud and latitud in order to create the APIUrl for the forecast and then call the API and then update the infromation for the forecast
function createForecastUrl(lat, lon) {
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(updateForecast);
}
// forecast cards update for the 5 following days from the current day
function updateForecast(response) {
  let forecastElement = document.querySelector("#forecast"); 
  forecastElement.innerHTML = null; 
  let forecast = null;
  let icon = null;
  for (let index = 1; index < 6; index++) {
    icon = response.data.daily[index].weather[0].icon;
    let forecastIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`
    forecast = response.data.daily[index];
    let forecastTimestamp = forecast.dt * 1000; // API response  in Unix time multiplied by 1000  to convert the UNIX timestamp from seconds to milliseconds.
    let forecastInfo = new Date(forecastTimestamp);  
    let forecastDay = forecastInfo.getDay(); // days part from the timestamp
    let forecastWeekDay = weekDays[forecastDay]; // return the forecastDay day from weekDays array. 
    forecastElement.innerHTML += 
                `<div class="forecast-day">
                ${forecastWeekDay}
                <br />
                <img src=${forecastIcon} alt="forecast">
                <br />
                <span class="temperature-forecast">${Math.round(
                  forecast.temp.max
                )}°C <strong>/</strong> ${Math.round(
      forecast.temp.min
    )}°C </span> </div>`
           ;
  }
}
// API Call  City search by the user. 
function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios
    .get(apiUrl)
    .then(updateMainCity)
    .catch((err) => alert("We Can't Find this City please try again 😎"));
}
//Acces to the  value search in the form and send it to the function that calls the API for the searched city by the user. 
function cityLookUp(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#search-city").value;
  searchCity(searchedCity);
}


function convertTemperatureFarenheit(event) {
  event.preventDefault();
  celsiusTemperatureLink.classList.remove("active");
  fahrenheitTemperature.classList.add("active");
  let fahrenheitConversion = (celsiusTemperature * 9) / 5 + 32;
  document.querySelector(".actual-temp").innerHTML = Math.round(
    fahrenheitConversion
  );
}

function convertTemperatureCelsius(event) {
  event.preventDefault();
  celsiusTemperatureLink.classList.add("active");
  fahrenheitTemperature.classList.remove("active");
  document.querySelector(".actual-temp").innerHTML = Math.round(
    celsiusTemperature
  );
}

let localDate = document.querySelector(".current-date");
localDate.innerHTML = currentDate();

let searchForm = document.querySelector("#form");
searchForm.addEventListener("submit", cityLookUp);

let celsiusTemperature = null;

let fahrenheitTemperature = document.querySelector("#fahrenheit-temp");
fahrenheitTemperature.addEventListener("click", convertTemperatureFarenheit);

let celsiusTemperatureLink = document.querySelector("#celsius-temp");
celsiusTemperatureLink.addEventListener("click", convertTemperatureCelsius);

searchCity("Dublin");