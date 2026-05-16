const cityEl = document.getElementById("city");
const conditionEl = document.getElementById("condition");
const windEl = document.getElementById("wind");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const feelsLikeEl = document.getElementById("feelsLike");
const updatedEl = document.getElementById("updated");
const forecastEl = document.getElementById("forecast");

const weatherImage =
  document.getElementById("weatherImage");

const searchBtn =
  document.getElementById("searchBtn");

const searchInput =
  document.getElementById("searchInput");

const searchPanel =
  document.getElementById("searchPanel");

const myLocationBtn =
  document.getElementById("myLocationBtn");



/* CLOUDINARY */

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/doyst59sb/image/upload/v1778868539/weathers/";



/* STATE */

let isManualSearch = false;

let currentCoords = null;

let lastFetch = "";



/* WEATHER IMAGE */

function getWeatherImage(condition, isDay){

  const text = condition.toLowerCase();

  if(!isDay){
    return `${CLOUDINARY_BASE}night-clear.png`;
  }

  if(text.includes("sun") || text.includes("clear")){
    return `${CLOUDINARY_BASE}sunny.png`;
  }

  if(text.includes("cloud") || text.includes("overcast")){
    return `${CLOUDINARY_BASE}cloudy.png`;
  }

  if(text.includes("rain") || text.includes("drizzle")){
    return `${CLOUDINARY_BASE}rainy.png`;
  }

  if(text.includes("storm") || text.includes("thunder")){
    return `${CLOUDINARY_BASE}storm.png`;
  }

  if(text.includes("snow")){
    return `${CLOUDINARY_BASE}snow.png`;
  }

  if(text.includes("mist") || text.includes("fog")){
    return `${CLOUDINARY_BASE}mist-foggy.png`;
  }

  return `${CLOUDINARY_BASE}sunny.png`;
}



/* RENDER WEATHER */

function renderWeather(data){

  weatherImage.src =
    getWeatherImage(
      data.current.condition.text,
      data.current.is_day
    );

  cityEl.textContent =
    `${data.location.name}, ${data.location.region}`;

  conditionEl.textContent =
    data.current.condition.text;

  windEl.textContent =
    `🍃 Wind: ${data.current.wind_kph} km/h`;

  tempEl.textContent =
    `${Math.round(data.current.temp_c)}°C`;

  humidityEl.textContent =
    `${data.current.humidity}%`;

  feelsLikeEl.textContent =
    `${Math.round(data.current.feelslike_c)}°C`;

  updatedEl.textContent =
    `Last updated: ${data.current.last_updated}`;

  forecastEl.innerHTML = "";

  data.forecast.forecastday.forEach(day => {

    const date =
      new Date(day.date);

    const dayName =
      date.toLocaleDateString(
        "en-US",
        { weekday:"short" }
      );

    forecastEl.innerHTML += `
      <tr>
        <td>${dayName}</td>
        <td>${Math.round(day.day.avgtemp_c)}°C</td>
      </tr>
    `;
  });
}



/* GET WEATHER */

async function getWeather(city){

  if(city === lastFetch) return;

  lastFetch = city;

  try{

    const response =
      await fetch(`/weather?city=${city}`);

    const data =
      await response.json();

    if(data.error){

      cityEl.textContent =
        "City not found";

      return;
    }

    renderWeather(data);

  }catch(error){

    console.log(error);

    cityEl.textContent =
      "Error loading weather";
  }
}



/* LOCATION */

function getCurrentLocation(){

  cityEl.textContent =
    "📍 Detecting location...";

  navigator.geolocation.getCurrentPosition(

    (position) => {

      isManualSearch = false;

      currentCoords = {

        lat:position.coords.latitude,
        lon:position.coords.longitude
      };

      getWeather(
        `${currentCoords.lat},${currentCoords.lon}`
      );

    },

    () => {

      cityEl.textContent =
        "Location access denied";
    },

    {
      enableHighAccuracy:true,
      maximumAge:300000
    }

  );
}



/* LIVE TRACKING */

navigator.geolocation.watchPosition(

  (position) => {

    if(isManualSearch) return;

    const lat =
      position.coords.latitude;

    const lon =
      position.coords.longitude;

    if(
      currentCoords &&
      Math.abs(lat - currentCoords.lat) < 0.01 &&
      Math.abs(lon - currentCoords.lon) < 0.01
    ){
      return;
    }

    currentCoords = { lat, lon };

    getWeather(`${lat},${lon}`);

  },

  null,

  {
    enableHighAccuracy:false,
    maximumAge:300000,
    timeout:10000
  }

);



/* SEARCH */

searchBtn.addEventListener("click", () => {

  searchPanel.classList.toggle("active");

  searchInput.focus();

});



/* SEARCH CITY */

searchInput.addEventListener("keydown", (e) => {

  if(e.key === "Enter"){

    const city =
      searchInput.value.trim();

    if(city){

      isManualSearch = true;

      cityEl.textContent =
        `🔍 Detecting ${city}...`;

      getWeather(city);

      searchInput.value = "";

      searchPanel.classList.remove("active");
    }
  }
});



/* MY LOCATION */

myLocationBtn.addEventListener(
  "click",
  () => {

    searchPanel.classList.remove("active");

    getCurrentLocation();
  }
);



/* INITIAL LOAD */

getCurrentLocation();