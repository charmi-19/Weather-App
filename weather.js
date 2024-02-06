const apiKey = "ba2afe58c3f13f9c2c2514a8899556ec";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const minTemperatureElement = document.getElementById("min");
const maxTemperatureElement = document.getElementById("max");
const feelsLikeTemperatureElement = document.getElementById("feelsLike");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const weatherElement = document.getElementById("weather");
const alertElement = document.getElementById("alert");

let latitude = 52.4229876;
let longitude = 10.7953713;
locationElement.textContent = "Wolfsburg";

const fetchWeather = (latitude, longitude) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("fetchWeather", data);
      temperatureElement.textContent = `${Math.round(data.main.temp)}`;
      minTemperatureElement.textContent = `${Math.round(data.main.temp_min)}`;
      maxTemperatureElement.textContent = `${Math.round(data.main.temp_max)}`;
      feelsLikeTemperatureElement.textContent = `${Math.round(
        data.main.feels_like
      )}`;
      weatherElement.textContent = data.weather[0].main;
      humidityElement.textContent = data.main.humidity + "%";
      windElement.textContent = data.wind.speed + "km/h";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
};

const checkLocationPermission = () => {
  fetchWeather(latitude, longitude);
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      console.log(`Permission ${result.state}`);
    } else if (result.state === "prompt") {
      console.log(`Permission ${result.state}`);
      navigator.geolocation.getCurrentPosition(showPosition);
    } else if (result.state === "denied") {
      console.log(`Permission ${result.state}`);
      alertElement.style.visibility = "visible";
      alertElement.textContent = "Permission Denied!";
    }
    result.addEventListener("change", () => {
      console.log(`Permission ${result.state}`);
    });
  });
};

const showPosition = (position) => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  fetchWeather(latitude, longitude);
};

window.onload = checkLocationPermission();

searchButton.addEventListener("click", async () => {
  const location = locationInput.value;
  if (location) {
    fetchLatitudeAndLongitude(location);
  }
});

const fetchLatitudeAndLongitude = (location) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("fetchLatitudeAndLongitude", data);
      latitude = data[0].lat;
      longitude = data[0].lon;
      locationElement.textContent = data[0].name;
      locationInput.value = "";
      fetchWeather(latitude, longitude);
    });
};
