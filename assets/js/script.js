var inputEl = document.getElementById('search-city');
var searchBtn = document.getElementById('search-btn');
var todayDiv = document.getElementById('weather-today');
var fiveDayDiv = document.getElementById('5-day-forecast');


function getApi (){
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={d6e36cd62e6cfcf651eefb5f7aa8d3dd}'

    fetch(requestUrl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data)
        
    })

}