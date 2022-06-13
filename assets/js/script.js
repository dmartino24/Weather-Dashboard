var savedCities = [];
var buttonListEl = document.querySelector("#button-list");
var todayForecastEl = document.querySelector("#today-forecast");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var fiveDayTitleEl = document.querySelector("#five-day-title");
var searchButtonEl = document.querySelector("#btn-search");
var selectedCity;
const updatePage = function () {
  for (let i = 0; i < localStorage.length; i++) {
    savedCities.push(JSON.parse(localStorage.getItem(i)));
  }
  updateUI();
};
const updateUI = function (data) {
  removeElements();
  updateButtonList();
};
const removeElements = function() {
    while(buttonListEl.firstChild){
        buttonListEl.removeChild(buttonListEl.firstChild);
    }
    // while(todayForecastEl.firstChild){
    //     todayForecastEl.removeChild(todayForecastEl.firstChild);
    // }
    // while(fiveDayForecastEl.firstChild){
    //     fiveDayForecastEl.removeChild(fiveDayForecastEl.firstChild);
    // }
    fiveDayTitleEl.textContent = "";

}
const updateButtonList = function () {
  for (let i = 0; i < savedCities.length; i++) {
    let buttonEl = document.createElement("button");
    buttonEl.className = "mt-3 btn btn-lg btn-secondary";
    console.log(savedCities[i]);
    buttonEl.innerHTML = savedCities[i].name;

    buttonListEl.appendChild(buttonEl);
  }
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
    "&appid=" +
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
