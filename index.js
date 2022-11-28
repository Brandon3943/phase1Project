import {API_KEY} from "/api.js";
let CityPrompt = prompt('Please enter city name');
let listOfWeather = document.createElement('ul');
let cityInfo = document.createElement('h1');
cityInfo.innerText = `${CityPrompt.toUpperCase()}`
listOfWeather.append(cityInfo);
document.body.append(listOfWeather);




//first gets latitude and logitude from entered city, then get weather info from latitude and logitude
function getLatLon(test) {
  let city = test;
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
  .then(responce => responce.json())
  .then(data => data.forEach(element => {
      if(element.state === "Florida") {
        let lat = element.lat;
        let lon = element.lon;
        return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,daily&appid=${API_KEY}`)
        .then(responce => responce.json())
        .then(data => renderALL(data))
      }
  }));
};    
getLatLon(CityPrompt);



function renderTeampHeader(data) {
  let tempData = document.createElement('h2');
  tempData.innerText = `Temp ${Math.round(data.current.temp)}`;
  listOfWeather.append(tempData);
}
function renderFeelsLike(data) {
  let feelsData = document.createElement('h2');
  feelsData.innerText = `Feels like ${Math.round(data.current.feels_like)}`;
  listOfWeather.append(feelsData);
}
function renderHumidity(data) {
  let humidity = document.createElement('h2');
  humidity.innerText = `Humidity ${data.current.humidity}`;
  listOfWeather.append(humidity);
}
function renderAtomosphere(data) {
  let atomosphere = document.createElement('h2');
  atomosphere.innerText = `${data.current.weather[0].description}`;
  listOfWeather.append(atomosphere);
}
function renderALL(data) {
  renderTeampHeader(data);
  renderFeelsLike(data);
  renderHumidity(data);
  renderAtomosphere(data);
}




