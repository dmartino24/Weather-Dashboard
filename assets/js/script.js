// global vars
var savedCities = [];
var buttonListEl = document.querySelector("#button-list");
var todayForecastEl = document.querySelector("#today-forecast");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var fiveDayTitleEl = document.querySelector("#five-day-title");
var searchButtonEl = document.querySelector("#btn-search");
var selectedCity;
var today = new Date();
var day = String(today.getDate()).padStart(2, "0");
var month = String(today.getMonth() + 1).padStart(2, "0");
var year = today.getFullYear();

today = month + "/" + day + "/" + year;

// main function to update the page
const updatePage = function () {
  for (let i = 0; i < localStorage.length; i++) {
    savedCities.push(JSON.parse(localStorage.getItem(i)));
  }
  updateUI();
};
// updates the dynamic html elements
const updateUI = function (data) {
  removeElements();
  updateButtonList();
  if (data) {
    updateTodayForecast(data);
  }
};
// updates the five day forecast
const updateFiveDayForecast = function (data) {
  let titleEl = document.createElement("h3");
  titleEl.textContent = "5-Day Forecast: "
  titleEl.id = "five-day-title";
  fiveDayForecastEl.append(titleEl);
  for (let i = 1; i < 6; i++) {
    let cardEl = document.createElement("div");
    let cardBodyEl = document.createElement("div");
    let cardTitleEl = document.createElement("div");
    let iconEl = document.createElement("img");
    let tempEl = document.createElement("p");
    let windEl = document.createElement("p");
    let humidityEl = document.createElement("p");

    cardEl.className = "card";
    cardBodyEl.className = "card-body";
    cardTitleEl.className = "card-title";
    tempEl.className = "card-text";
    windEl.className = "card-text";
    humidityEl.className = "card-text";
    const unix_timestamp = data.daily[i].dt;
    let d = new Date(unix_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = d.getFullYear();
    var month = months[d.getMonth()];
    var day = d.getDate();
    cardTitleEl.textContent = month + "/" +  day + "/" + year;
    const iconCode = data.daily[i].weather[0].icon;
    iconEl.src = `https://openweathermap.org/img/w/${iconCode}.png`;
    tempEl.textContent = "Temp: " + data.daily[i].temp.day + "\u2109";
    windEl.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
    fiveDayForecastEl.appendChild(cardEl);
    cardEl.appendChild(cardBodyEl);
    cardBodyEl.appendChild(cardTitleEl);
    cardBodyEl.appendChild(iconEl);
    cardBodyEl.appendChild(tempEl);
    cardBodyEl.appendChild(windEl);
    cardBodyEl.appendChild(humidityEl);
  }
};
const updateTodayForecast = function (data) {
  todayForecastEl.classList.add("border");
  const iconCode = data.weather[0].icon;
  const weatherIconEl = document.createElement("img");
  weatherIconEl.src = `https://openweathermap.org/img/w/${iconCode}.png`;
  const todayTitleEl = document.createElement("h3");
  todayTitleEl.textContent = data.name + " " + today;
  todayTitleEl.appendChild(weatherIconEl);
  todayForecastEl.appendChild(todayTitleEl);

  const tempEl = document.createElement("p");
  const windEl = document.createElement("p");
  const humidityEl = document.createElement("p");
  const uvIndexEl = document.createElement("p");
  const uvIndexSpanEl = document.createElement("span");
  tempEl.textContent = "Temp: " + data.main.temp + "\u2109";
  windEl.textContent = "Wind: " + data.wind.speed + " MPH";
  humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
  uvIndexEl.textContent = "UV Index: ";

  tempEl.className = "fs-5 fw-bold";
  windEl.className = "fs-5 fw-bold";
  humidityEl.className = "fs-5 fw-bold";
  uvIndexEl.className = "fs-5 fw-bold"
  todayForecastEl.appendChild(tempEl);
  todayForecastEl.appendChild(windEl);
  todayForecastEl.appendChild(humidityEl);
  todayForecastEl.appendChild(uvIndexEl);

  let lat = data.coord.lat;
  let lon = data.coord.lon;
  const key = "24ab0d6fe4d90e6881686a1fcc7b9943";
  let url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly&units=imperial&appid=" +
    key;

  fetch(url).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        const uvIndex = data.current.uvi;
        uvIndexSpanEl.textContent = uvIndex;
        if (uvIndex <= 3) {
          uvIndexSpanEl.className = "bg-success rounded p-1 fs-5 fw-bold";
        } else if (uvIndex > 3 && uvIndex <= 6) {
          uvIndexSpanEl.className = "bg-warning rounded p-1 fs-5 fw-bold";
        } else {
          uvIndexSpanEl.className = "bg-danger rounded p-1 fs-5 fw-bold";
        }
        uvIndexEl.appendChild(uvIndexSpanEl);
        updateFiveDayForecast(data);
      });
    } else {
      alert("Could not find that city.");
    }
  });
};
const updateButtonList = function () {
  for (let i = 0; i < savedCities.length; i++) {
    let buttonEl = document.createElement("button");
    buttonEl.className = "mt-3 btn btn-lg btn-secondary";
    buttonEl.innerHTML = savedCities[i].name;
    buttonEl.value = savedCities[i].name;
    buttonEl.addEventListener("click", buttonClickHandler);
    buttonListEl.appendChild(buttonEl);
  }
};
const buttonClickHandler = function (event) {
  fetchCity(event.target.value);
};
const removeElements = function () {
  while (buttonListEl.firstChild) {
    buttonListEl.removeChild(buttonListEl.firstChild);
  }
  while (todayForecastEl.firstChild) {
    todayForecastEl.removeChild(todayForecastEl.firstChild);
  }
  while (fiveDayForecastEl.firstChild) {
    fiveDayForecastEl.removeChild(fiveDayForecastEl.firstChild);
  }
  fiveDayTitleEl.textContent = "";
  todayForecastEl.classList.remove("border");
};
const searchCity = function () {
  let cityInput = document.querySelector("#city-input").value.trim();
  fetchCity(cityInput);
};
const saveData = function (data) {
  savedCities.unshift(data);
  console.log(savedCities[0]);
  if (savedCities.length > 8) {
    savedCities.pop();
    //localStorage.removeItem(cityToRemove);
  }
  console.log(savedCities.length, data);
  localStorage.setItem(savedCities.length - 1, JSON.stringify(data));
};
const fetchCity = function (input) {
  const key = "24ab0d6fe4d90e6881686a1fcc7b9943";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    input +
    "&units=imperial&appid=" +
    key;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        saveData(data);
        updateUI(data);
      });
    } else {
      alert("Could not find that city.");
    }
  });
};
updatePage();
searchButtonEl.addEventListener("click", searchCity);
