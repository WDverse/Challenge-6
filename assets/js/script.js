var inputEl = document.getElementById('search-city');
var searchBtn = document.getElementById('search-btn');
var todayDiv = document.getElementById('weather-today');
var forecastDiv = document.getElementById('five-day-forecast');
var apiKey = 'd6e36cd62e6cfcf651eefb5f7aa8d3dd';
var weatherToday = document.getElementById('weather-info');
var forecastHeader = document.getElementById('forecast')
var currentDay = dayjs().format('DD/MM/YYYY')
var currentDayEl = document.getElementById('current-day');
forecastHeader.style.display = 'none';
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function getApi(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('weather', data)
            renderWeather(data.list)
            renderForecast(data.list);
        })


}
function getCoords(city) {
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('data', data[0].lat)
            getApi(data[0].lat, data[0].lon);

        })
}

function renderWeather(data) {
    weatherToday.innerHTML = '';
    currentDayEl.textContent = inputEl.value.trim() + " " + currentDay;
    var currentIcon = document.getElementById('current-icon');
    currentIcon.src = `https://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`
    console.log('icon: ', `${data[0].weather[0].icon}`);
    todayDiv.append(currentIcon);
    var tempEl = document.createElement('li');
    tempEl.textContent = `Temp: ${data[0].main.temp} `
    var humidityEl = document.createElement('li');
    humidityEl.textContent = `Humidity: ${data[0].main.humidity}% `
    var windSpeedEl = document.createElement('li');
    windSpeedEl.textContent = `Wind: ${data[0].wind.speed} MPH `
    weatherToday.append(tempEl, humidityEl, windSpeedEl);


}

function searchFormSubmit(event) {
    forecastDiv.innerHTML = '5-Day Forecast';
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
    forecastHeader.style.display = 'block';


    for (var i = 0; i < dailyForecast.length; i++) {
        forecastHeader.setAttribute('style', 'display: block');
        console.log(dailyForecast[i].dt)
        const date = dayjs(dailyForecast[i].dt * 1000)
        console.log(date)
        date.format("DD/MM/YYYY");

        // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {

            // Then filters through the data and returns only data captured at noon for each day.
            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                //   forecastDiv(dailyForecast[i]);
                var nextDayDiv = document.createElement('div');
                var futureDate = document.createElement('header');
                futureDate.textContent = date.format("DD/MM/YYYY");
                var forecastIcon = document.createElement('img');
                forecastIcon.src = `https://openweathermap.org/img/wn/${dailyForecast[i].weather[0].icon}@2x.png`
                var nextDayInfo = document.createElement('ul');
                var nextDayTemp = document.createElement('li');
                var nextDayWind = document.createElement('li');
                var nextDayHumid = document.createElement('li');

                nextDayTemp.textContent = "Temp: " + dailyForecast[i].main.temp;
                nextDayWind.textContent = "Wind: " + dailyForecast[i].wind.speed + " MPH";
                nextDayHumid.textContent = "Humidity: " + dailyForecast[i].main.humidity + "%";
                nextDayInfo.appendChild(nextDayTemp);
                nextDayInfo.appendChild(nextDayWind);
                nextDayInfo.appendChild(nextDayHumid);
                nextDayDiv.appendChild(futureDate);
                nextDayDiv.appendChild(forecastIcon);
                nextDayDiv.appendChild(nextDayInfo);
                forecastDiv.appendChild(nextDayDiv);
            }
        }
    }

}