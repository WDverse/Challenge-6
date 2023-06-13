var inputEl = document.getElementById('search-city');
var searchBtn = document.getElementById('search-btn');
var todayDiv = document.getElementById('weather-today');
var fiveDayDiv = document.getElementById('5-day-forecast');
var apiKey = 'd6e36cd62e6cfcf651eefb5f7aa8d3dd';
var weatherToday = document.getElementById('weather-info');

function getApi (lat,lon){
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log('weather', data)
        renderWeather(data.list)
    })


}
function getCoords (city){
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    
    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log('data', data[0].lat)
        getApi(data[0].lat, data[0].lon);
        
    })
}

function renderWeather (data){
    weatherToday.innerHTML = '';
    var tempEl = document.createElement('li');
    tempEl.textContent = `temp: ${data[0].main.temp} `
    var humidityEl = document.createElement('li');
    humidityEl.textContent = `humidity: ${data[0].main.humidity} `
    weatherToday.append(tempEl, humidityEl);


}

function searchFormSubmit (event){
    // console.log(event);
    event.preventDefault();
    var cityInput = inputEl.value.trim();
    // console.log('cityInput', cityInput); 
    getCoords(cityInput);
}

searchBtn.addEventListener('click', searchFormSubmit);


// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
    // Create unix timestamps for start and end of 5 day forecast
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
  
  
    for (var i = 0; i < dailyForecast.length; i++) {
  
      // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
      if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
  
        // Then filters through the data and returns only data captured at noon for each day.
        if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
        //   renderForecastCard(dailyForecast[i]);
        }
      }
    }
  }