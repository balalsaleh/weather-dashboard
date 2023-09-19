// i defined constant variables for my API keys and endpoints
const myApi = '9f10f98e44e03c1fc319072d6d87a39d';
const ApiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';
const forecastEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';

// this is an array to store the search history
const searchHistory = [];

// this function is used to fetch current weather data for a city
function fetchCurrentWeather(city) {
  const url = `${ApiEndpoint}?q=${city}&appid=${myApi}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        // Successfully fetched current weather data
        const cityName = data.name;
        // Convert timestamp to date
        const date = new Date(data.dt * 1000); 
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const weatherIcon = data.weather[0].icon;

        // this will update the the UI with current weather data
        updateCurrentWeather(cityName, date, temperature, humidity, windSpeed, weatherIcon);

        // this will fetch and display the 5-day forecast
        fetchForecast(city);
        
        // this will add the city to the search history
        addToSearchHistory(cityName);
      } else {
        console.error('Error fetching current weather data:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching current weather data:', error);
    });
}

// this is the function to fetch and display the 5-day forecast for a city
function fetchForecast(city) {
  const url = `${forecastEndpoint}?q=${city}&appid=${myApi}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // if its 200 its successful 
      if (data.cod === '200') {
        const forecastData = data.list.slice(0, 5); 
        
        // Update the UI with the 5-day forecast
        updateForecastUI(forecastData);
      } else {
        console.error('Error fetching 5-day forecast data:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error fetching 5-day forecast data:', error);
    });
}

// this fununction is to update the UI with current weather data the name, temp, humidity etc...
function updateCurrentWeather(cityName, date, temperature, humidity, windSpeed, weatherIcon) {
  document.getElementById('city-name').textContent = cityName;
  document.getElementById('date').textContent = date.toLocaleDateString();
  document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/w/${weatherIcon}.png`;
}

// this is the function to update the UI with the 5-day forecast
function updateForecastUI(forecastData) {
  const forecastDays = document.getElementById('forecast-days');
  // here we clear the existing forecast data
  forecastDays.innerHTML = ''; 

  forecastData.forEach((forecast) => {
    // here we convert the timestamp to date
    const date = new Date(forecast.dt * 1000); 
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const weatherIcon = forecast.weather[0].icon;

    // here we create the forecast card element
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    forecastCard.innerHTML = `
      <p>${date.toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
    `;

    forecastDays.appendChild(forecastCard);
  });
}

// create a functiom to add a city to the search history...
function addToSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);

    // here we update the search history 
    updateSearchHistory();
  }
}

// this is a function to update the search history
function updateSearchHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';

  searchHistory.forEach((city) => {
    const historyItem = document.createElement('button');
    historyItem.classList.add('history-button');
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
      fetchCurrentWeather(city);
    });

    historyList.appendChild(historyItem);
  });
}

// here is the event listener for the search form submission
document.getElementById('search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const city = document.getElementById('search-input').value.trim();

  if (city) {
    fetchCurrentWeather(city);
  }
});

// this is the event listener for the search history buttons...
document.getElementById('history-list').addEventListener('click', (event) => {
  if (event.target && event.target.matches('button.history-button')) {
    const city = event.target.textContent;
    fetchCurrentWeather(city);
  }
});

// here we display the weather for the last searched city, if it is available
if (searchHistory.length > 0) {
  const lastSearchedCity = searchHistory[searchHistory.length - 1];
  fetchCurrentWeather(lastSearchedCity);
}
