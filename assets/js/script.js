// Get references to HTML elements by their IDs
var inputEl = document.getElementById("search-city"); // Input field for city search
var searchBtn = document.getElementById("search-btn"); // Search button
var todayDiv = document.getElementById("todayDiv"); // Container for current weather information
var forecastDiv = document.getElementById("five-day-forecast"); // Container for 5-day forecast
var apiKey = "d6e36cd62e6cfcf651eefb5f7aa8d3dd"; // API key for weather data
var weatherInfo = document.getElementById("weather-info"); // List for weather information
var forecastHeader = document.getElementById("forecast"); // Header for 5-day forecast
var currentDay = dayjs().format("DD/MM/YYYY"); // Get the current date in the specified format
var currentDayEl = document.getElementById("current-day"); // Element to display the current date

// Hide the 5-day forecast header initially
forecastHeader.style.display = "none";

// Extend the functionality of the Day.js library with plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Hide the container for current weather information initially
todayDiv.style.display = "none";

// Function to fetch weather data by latitude and longitude
function getApi(lat, lon) {
  // Construct the URL for the OpenWeatherMap API request
  var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  // Fetch data from the API
  fetch(requestUrl)
    .then(function (response) {
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
      console.log("weather", data); // Log the weather data to the console
      renderWeather(data.list); // Call a function to render the current weather
      renderForecast(data.list); // Call a function to render the 5-day forecast
    });
}

// Function to get coordinates (latitude and longitude) for a given city
function getCoords(city) {
  // Construct the URL for the OpenWeatherMap API request to get coordinates
  var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

  // Fetch data from the API
  fetch(requestUrl)
    .then(function (response) {
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
      console.log("data", data[0].lat); // Log the latitude of the city
      // Call the getApi function with the retrieved latitude and longitude
      getApi(data[0].lat, data[0].lon);
    });
}

// Function to render the current weather information
function renderWeather(data) {
  // Clear any previous weather information from the weatherInfo element
  weatherInfo.innerHTML = "";

  // Display the container for current weather information
  todayDiv.style.display = "block";

  // Set the text content of currentDayEl to show the city name and current date
  currentDayEl.textContent = inputEl.value.trim() + " " + currentDay;

  // Create an element to display the weather icon
  var currentIcon = document.getElementById("current-icon");
  currentIcon.classList.add("icon");

  // Set the src attribute of the currentIcon element to display the weather icon
  currentIcon.src = `https://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`;

  // Log the weather icon to the console
  console.log("icon: ", `${data[0].weather[0].icon}`);

  // Append the currentIcon element to currentDayEl to display the weather icon
  currentDayEl.append(currentIcon);

  // Create elements to display temperature, humidity, and wind speed
  var tempEl = document.createElement("li");
  tempEl.textContent = `Temp: ${data[0].main.temp} ℃ `;

  var humidityEl = document.createElement("li");
  humidityEl.textContent = `Humidity: ${data[0].main.humidity}% `;

  var windSpeedEl = document.createElement("li");
  windSpeedEl.textContent = `Wind: ${data[0].wind.speed} MPH `;

  // Append temperature, humidity, and wind speed elements to weatherInfo
  weatherInfo.append(tempEl, humidityEl, windSpeedEl);
}
// Function to handle the form submission when the search button is clicked
function searchFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior (page reload)

  // Get the trimmed value from the input field (city name)
  var cityInput = inputEl.value.trim();

  // Call the getCoords function to fetch coordinates for the entered city
  getCoords(cityInput);
}

// Add an event listener to the search button, listening for a click event
searchBtn.addEventListener("click", searchFormSubmit);

// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
  // Create unix timestamps for start and end of 5 day forecast
  var startDt = dayjs().add(1, "day").startOf("day").unix(); // Start with tomorrow
  var endDt = dayjs().add(6, "day").startOf("day").unix(); // End with the day after tomorrow

  // Display the 5-day forecast header
  forecastHeader.style.display = "block";

  // Loop through the daily forecast data
  for (var i = 0; i < dailyForecast.length; i++) {
    // Ensure the forecast header is displayed
    forecastHeader.setAttribute("style", "display: block");

    // Create a Date object from the Unix timestamp (multiply by 1000 for milliseconds)
    const date = dayjs(dailyForecast[i].dt * 1000);

    // Format the date as "DD/MM/YYYY"
    const formattedDate = date.format("DD/MM/YYYY");

    // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
      // Then filters through the data and returns only data captured at noon for each day.
      // Check if the time of the forecast data is 12:00 (noon)
      if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
        // Create a new div element for the next day's forecast
        var nextDayDiv = document.createElement("div");
        nextDayDiv.classList.add("nextDay"); // Add a CSS class to the div

        // Create a header element to display the future date
        var futureDate = document.createElement("header");
        futureDate.textContent = date.format("DD/MM/YYYY"); // Set the text content with the formatted date
        futureDate.classList.add("futureDate"); // Add a CSS class to the header

        // Create an image element for the forecast icon
        var forecastIcon = document.createElement("img");
        // Set the src attribute of the forecast icon based on the weather icon code
        forecastIcon.src = `https://openweathermap.org/img/wn/${dailyForecast[i].weather[0].icon}@2x.png`;

        // Create an unordered list element for the next day's weather information
        var nextDayInfo = document.createElement("ul");

        // Create list items for temperature, wind, and humidity
        var nextDayTemp = document.createElement("li");
        var nextDayWind = document.createElement("li");
        var nextDayHumid = document.createElement("li");

        // Set the text content for temperature, wind, and humidity
        nextDayTemp.textContent = "Temp: " + dailyForecast[i].main.temp + " ℃";
        nextDayWind.textContent =
          "Wind: " + dailyForecast[i].wind.speed + " MPH";
        nextDayHumid.textContent =
          "Humidity: " + dailyForecast[i].main.humidity + "%";

        // Append the temperature, wind, and humidity list items to the nextDayInfo
        nextDayInfo.appendChild(nextDayTemp);
        nextDayInfo.appendChild(nextDayWind);
        nextDayInfo.appendChild(nextDayHumid);

        // Append the future date, forecast icon, and weather information to the nextDayDiv
        nextDayDiv.appendChild(futureDate);
        nextDayDiv.appendChild(forecastIcon);
        nextDayDiv.appendChild(nextDayInfo);

        // Append the nextDayDiv to the forecastDiv to display the next day's forecast
        forecastDiv.appendChild(nextDayDiv);
      }
    }
  }
}
