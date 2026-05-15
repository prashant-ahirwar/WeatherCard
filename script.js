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



/* ---------------- CLOUDINARY ---------------- */

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/doyst59sb/image/upload/v1778868539/weathers/";



/* ------------ WEATHER IMAGE MAP ------------ */

function getWeatherImage(condition, isDay){

  const text = condition.toLowerCase();

  if(!isDay){
    return `${CLOUDINARY_BASE}night-clear.png`;
  }

  if(text.includes("sun") || text.includes("clear")){
    return `${CLOUDINARY_BASE}sunny.png`;
  }

  if(
    text.includes("cloud") ||
    text.includes("overcast")
  ){
    return `${CLOUDINARY_BASE}cloudy.png`;
  }

  if(
    text.includes("rain") ||
    text.includes("drizzle")
  ){
    return `${CLOUDINARY_BASE}rainy.png`;
  }

  if(
    text.includes("storm") ||
    text.includes("thunder")
  ){
    return `${CLOUDINARY_BASE}storm.png`;
  }

  if(text.includes("snow")){
    return `${CLOUDINARY_BASE}snow.png`;
  }

  if(
    text.includes("mist") ||
    text.includes("fog")
  ){
    return `${CLOUDINARY_BASE}mist-foggy.png`;
  }

  return `${CLOUDINARY_BASE}sunny.png`;
}



/* ---------------- GET WEATHER ---------------- */

async function getWeather(city="Indore") {

  try {

    const response = await fetch(
      `http://localhost:3000/weather?city=${city}`
    );

    const data = await response.json();

    if(data.error){

      cityEl.textContent =
        "City not found";

      return;
    }



    /* ------------ WEATHER IMAGE ------------ */

    const imageUrl = getWeatherImage(
      data.current.condition.text,
      data.current.is_day
    );

    weatherImage.src = imageUrl;



    /* ------------ WEATHER INFO ------------ */

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



    /* ------------ FORECAST ------------ */

    forecastEl.innerHTML = "";

    data.forecast.forecastday.forEach(day => {

      const date = new Date(day.date);

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

  } catch(error){

    console.log(error);

    cityEl.textContent =
      "Error loading weather";
  }
}



/* ---------------- SEARCH ---------------- */

searchBtn.addEventListener("click", () => {

  searchInput.classList.toggle("active");

  searchInput.focus();

});



searchInput.addEventListener("keydown", (e) => {

  if(e.key === "Enter"){

    const city =
      searchInput.value.trim();

    if(city){

      getWeather(city);

      searchInput.value = "";

      searchInput.classList.remove("active");
    }
  }
});



/* ---------------- INITIAL LOAD ---------------- */

getWeather();