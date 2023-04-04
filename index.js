// formatting time and day
const apiKey = "e39ce65e9144a9f4b001c2cd079e4587";
let tempUnit = 'celcius'
const formatTime = (date) => {
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
  
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  }
  
const formatDay = (date) => {
    // console.log({date})
    const dayArray = date.getDay();
    // console.log({dayArray})
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const day = days[dayArray];
    return day;
  }


  const handleToggle = (unit) => {
    if(unit === 'celcius'){
        tempUnit = 'celcius'
    }
    else{
        tempUnit = 'farhenheit'
    }
}


  // getting current time & day and displaying it
  const currentTime = document.querySelector("#current-time");
  let newCurrentTime = new Date();
  currentTime.innerHTML = formatTime(newCurrentTime);
  
  const currentDay = document.querySelector("#current-day");
  let newCurrentDay = new Date();
  currentDay.innerHTML = formatDay(newCurrentDay);
  
  // implementing search bar and api request
const displayWeatherInfo = (response) => {
    document.querySelector("#searched-city").innerHTML = response.name;
    let temperature = Math.round(response.main.temp);
    temperature = (temperature - 273)
    document.querySelector("#current-temperature").innerHTML = `${temperature}°`;
    const humidity = response.main.humidity;
    document.querySelector("#humidity").innerHTML = `${humidity}%`;
    const windSpeed = Math.round(response.wind.speed);
    document.querySelector("#wind").innerHTML = `${windSpeed}km/h`;
    document.querySelector("#weather-type").innerHTML =
      response.weather[0].main;
}

const getWeekDays = (list) => {
    let weekDays = []
    let lastDate = ""
    for(let i = 0; i < list.length; i++){
        let date = list[i].dt_txt.split(' ')[0]
        
        if(lastDate !== date){
            lastDate = date
            weekDays.push(list[i])
        }
        if(weekDays.length >= 7){
            break
        }
    }
    console.log({weekDays})
    return weekDays
}

const displayWeeklyForecast = (response) => {
    // console.log(response)
    let forecastContainer = document.querySelector(".week-forecast")
    // console.log(forecastContainer)
    let list = response.list
    let weekDays = getWeekDays(list)
    for(let i = 0; i < weekDays.length; i++){
        let forecastDiv = document.createElement("div")
        forecastDiv.classList.add("col")
        let header = document.createElement("h3")
        let day = formatDay(new Date(weekDays[i]?.dt_txt))
        header.innerHTML = day.slice(0,3)
        forecastDiv.appendChild(header)
        let br = document.createElement("br")
        forecastDiv.appendChild(br)
        let image = document.createElement("img")
        image.src = `icons/${weekDays[i]?.weather[0]?.main?.toLowerCase()}.svg`
        image.style.height = '60px'
        image.style.width = 'auto'
        forecastDiv.appendChild(image)
        let para = document.createElement("p")
        para.classList.add("weather")
        para.innerHTML = weekDays[i]?.weather[0]?.description
        para.style.textTransform = "capitalize"
        forecastDiv.appendChild(para)
        let span = document.createElement("span")
        span.classList.add("degree")
        span.innerHTML = `${Math.round(weekDays[i].main.temp_min - 273)}° - ${Math.round(weekDays[i].main.temp_max - 273)}°`
        forecastDiv.appendChild(span)

        forecastContainer.appendChild(forecastDiv)
    }
    
}


  
const searchCity = (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    window.fetch(apiUrl).then((res) => displayWeatherInfo(res.data));
}

const weeklyForecast = (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    window.fetch(apiUrl).then((res) => displayWeeklyForecast(res.data));
} 
  
const handleSubmit = (event) => {
    event.preventDefault();
    let city = document.querySelector("#search-input").value;
    searchCity(city);
    weeklyForecast(city);
  }
  
const searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleSubmit);
  