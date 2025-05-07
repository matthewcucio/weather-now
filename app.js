const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const errorDiv = document.getElementById('error');
const recentSearchesDiv = document.getElementById('recent-searches');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
  saveRecentSearch(city);
});

async function fetchWeather(city) {
  errorDiv.classList.add('hidden');
  weatherDisplay.classList.add('hidden');
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');

    const data = await res.json();
    renderWeather(data);
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.classList.remove('hidden');
  }
}

function renderWeather(data) {
  const html = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡️ Temperature: ${data.main.temp} °C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    <p>🌥️ Weather: ${data.weather[0].main}</p>
  `;
  weatherDisplay.innerHTML = html;
  weatherDisplay.classList.remove('hidden');
}

function saveRecentSearch(city) {
  let searches = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!searches.includes(city)) {
    searches.unshift(city);
    if (searches.length > 5) searches.pop();
    localStorage.setItem('recentCities', JSON.stringify(searches));
  }
  renderRecentSearches();
}

function renderRecentSearches() {
  const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentSearchesDiv.innerHTML = cities
    .map(city => `<button class="recent-btn">${city}</button>`)
    .join('');

  document.querySelectorAll('.recent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cityInput.value = btn.textContent;
      fetchWeather(btn.textContent);
    });
  });
}

window.addEventListener('load', renderRecentSearches);
