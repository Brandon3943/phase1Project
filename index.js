import {API_KEY, UNSPLASH_KEY} from "/api.js";
let city, state;

//add elements to HTML page
let listOfWeather = document.createElement('ul');
let cityInfo = document.createElement('li');
listOfWeather.append(cityInfo);
document.body.append(listOfWeather);
let form = document.querySelector('#enterInfo');
form.addEventListener('submit', function(event) {
event.preventDefault();
 city = event.target.city.value;
 state = event.target.state.value;
 getLatLon(city, state);
 event.target.reset();
});

//first gets latitude and logitude from entered city, then get weather info from latitude and logitude
function getLatLon(city, state) {
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
  .then(responce => responce.json())
  .then(data =>  {
    let findState = data.find(obj => obj.state.toUpperCase() === state.toUpperCase())  
        let lat = findState.lat;
        let lon = findState.lon;
        if(lat && lon) {
        return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,daily&appid=${API_KEY}`)
        .then(responce => responce.json())
        .then(data => {
          renderALL(data, city, state);
          form.style.display = 'none';          
        })
        } else {
          return "Error"
        }
    }  
  )
  .catch(() => alert("Unexpected error, please try search again."))
}; 

function renderTeampHeader(data) {
  let tempData = document.createElement('li');
  tempData.className = 'weather-list';
  tempData.innerText = `Temp ${Math.round(data.current.temp)}𝇈`;
  listOfWeather.append(tempData);
}
function renderFeelsLike(data) {
  let feelsData = document.createElement('li');
  feelsData.className = 'weather-list1';
  feelsData.innerText = `Feels like ${Math.round(data.current.feels_like)}𝇈`;
  listOfWeather.append(feelsData);
}
function renderHumidity(data) {
  let humidity = document.createElement('li');
  humidity.className = 'weather-list2';
  humidity.innerText = ` ${data.current.humidity}% humidity`;
  listOfWeather.append(humidity);
}
function renderAtomosphere(data) {
  let atomosphere = document.createElement('li');
  atomosphere.className = 'weather-list3';
  atomosphere.innerText = `${data.current.weather[0].description}`;
  listOfWeather.append(atomosphere);
  getDateAndTime(data.timezone, atomosphere.textContent)
}
function getDateAndTime(timeZone, climate) {
  return fetch(`http://worldtimeapi.org/api/timezone/${timeZone}`)
  .then(r => r.json())
  .then(d => {
    let goodDate = new Date(d.datetime)
    let date = document.createElement('li');
    let hours = +d.datetime.slice(11).split('.')[0].slice(0, 5).split(':')[0];
    let minutes = +d.datetime.slice(11).split('.')[0].slice(0, 5).split(':')[1];    
    if(hours >= 13) {
      date.innerText = `${d.datetime.slice(0, 10).slice(5)} ${hours - 12}:${minutes}pm`;
      date.id = 'date-and-time';
      cityInfo.append(date);
    } else {
      date.innerText = `${d.datetime.slice(0, 10).slice(5)} ${hours}:${minutes}am`;
      date.id = 'date-and-time';
      cityInfo.append(date);
    }
    setBackground(timeZone, climate);
  })}


function setBackground(timeZone, climate) {
  return fetch(`http://worldtimeapi.org/api/timezone/${timeZone}`)
  .then(r => r.json())
  .then(d => {
    let background = document.querySelector("#backgroundIMG");
    if(city) {
      fetch(`https://api.unsplash.com/search/photos?page=1&query=${climate}&location[city]=${city}&client_id=${UNSPLASH_KEY}`)
        .then(response => response.json())
        .then(data => {
           background.src = data.results[Math.floor(Math.random() * 8)].urls.full;
        })
      }
    })
}  



function renderALL(data, genCity, genState) {
  cityInfo.textContent = `${genCity.toUpperCase()}, ${genState.toUpperCase()}`;
  cityInfo.id = 'city-name-state-name';
  renderTeampHeader(data);
  renderFeelsLike(data);
  renderHumidity(data);
  renderAtomosphere(data);
}

