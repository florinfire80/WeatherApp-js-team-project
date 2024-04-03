'use strict';
import {
  URL,
  KEY,
  baseUrlForTodayWeather,
  makeUrlForDetectedCityFromCurrentCoord,
} from '../config';

import {
  updateClock,
  getNumberEnding,
  formatDate,
  decodeTime,
  updateClockWithTimeZone,
} from './utilsForCurrentDay';

import {
  snowSvg,
  sunSvg,
  cloudsAndSunSvg,
  cloudySvg,
  sunriseSvg,
  sunsetSvg,
  rain,
  rainNight,
  thunderStorm,
} from './svgConstants';

import { showLoader, hideLoader } from '../Loader/loader';
import { Notify } from 'notiflix';

const currentTemperature = document.querySelector('.current-temperature');
const degreesMin = document.querySelector('.degrees-min');
const degreesMax = document.querySelector('.degrees-max');
const dateInfo = document.querySelector('.date-info__date');
const currentMonth = document.querySelector('.time__month');
const sunset = document.getElementById('sunset');
const sunrise = document.getElementById('sunrise');
const sunDetails = document.querySelector('.sun-details');
const sunLine = document.querySelector('.line-sun');
const cityText = document.getElementById('city');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const weatherInfo = document.querySelector('.weather-info__weather');
let clockUpdater;
let cityClockUpdater;

const weatherType = document.createElement('div');
weatherType.innerHTML = `${thunderStorm}`;

weatherInfo.prepend(weatherType);

const sunsetSvgElement = document.createElement('div');
sunsetSvgElement.innerHTML = `<svg class="sun-svg" width="20" height="20" class="card__icon" viewBox="0 0 32 32" fill="#FF6B09">${sunsetSvg}</svg>`;

const sunriseSvgElement = document.createElement('div');
sunriseSvgElement.innerHTML = `<svg class="sun-svg" width="20" height="20" viewBox="0 0 32 32" fill="#FF6B09">${sunriseSvg}</svg>`;

sunDetails.prepend(sunriseSvgElement);
sunLine.prepend(sunsetSvgElement);

const weatherData = {
  city: 'Bucharest',
  country: '',
  currentTemp: '',
  todayMax: '',
  todayMin: '',
  sunRise: '',
  sunSunset: '',
  currentDay: '',
  currentMonth: '',
  currentDayNumber: '',
  icon: '',
  timezone: '',
  locationTimezone: '',
};

formatDate(weatherData);

function startClockUpdate() {
  clockUpdater = setInterval(updateClock, 1000);
}

function startCityClockUpdate() {
  cityClockUpdater = setInterval(updateClockWithTimeZone(weatherData), 1000);
}

function stopCityClockUpdate() {
  clearInterval(cityClockUpdater);
}

function stopClockUpdate() {
  clearInterval(clockUpdater);
}

//Functie care afla locatia
function getCurrentLocationCoord() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  })
    .then(location => {
      const { latitude, longitude } = location.coords;
      const url = makeUrlForDetectedCityFromCurrentCoord(latitude, longitude);
      return fetch(url);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch current location data');
      }
      return response.json();
    })
    .then(data => {
      weatherData.city = data[0].name;
    })
    .catch(err => {
      console.error('Error:', err);
      throw err;
    });
}

//Functie care preia datele despre vreme
async function getWeatherForToday() {
  const response = await fetch(baseUrlForTodayWeather + weatherData.city);
  if (!response.ok) {
    throw new Error('City not found');
  }

  try {
    const data = await response.json();
    weatherData.currentTemp = Math.round(data.main.temp) + '°';
    weatherData.todayMax = Math.round(data.main.temp_max) + '°';
    weatherData.todayMin = Math.round(data.main.temp_min) + '°';
    weatherData.sunRise = decodeTime(data.sys.sunrise);
    weatherData.sunSunset = decodeTime(data.sys.sunset);
    weatherData.icon = data.weather[0].icon;
    weatherData.country = data.sys.country;
    weatherData.locationTimezone = data.timezone;
    console.log('Location timezone:', weatherData.locationTimezone);
  } catch (err) {
    console.error('Parsing response data failed:', err.message);
    throw err;
  }
}

async function getWeatherForCity() {
  try {
    const response = await fetch(baseUrlForTodayWeather + weatherData.city);
    if (!response.ok) {
      const errorMessage = "The city can't be found or is misspelled!";
      Notify.failure(errorMessage, { position: 'center-center' });
      throw new Error('City not found');
    }

    const data = await response.json();
    weatherData.currentTemp = Math.round(data.main.temp) + '°';
    weatherData.todayMax = Math.round(data.main.temp_max) + '°';
    weatherData.todayMin = Math.round(data.main.temp_min) + '°';
    weatherData.sunRise = decodeTime(data.sys.sunrise);
    weatherData.sunSunset = decodeTime(data.sys.sunset);
    weatherData.icon = data.weather[0].icon;
    weatherData.country = data.sys.country;
    weatherData.timezone = data.timezone;
  } catch (err) {
    console.error('Error fetching or parsing data:', err.message);

    await getWeatherForToday();
  }
}

const DayContent = `
<h3>${weatherData.currentDayNumber}<sup class="exponent">${getNumberEnding(
  weatherData.currentDayNumber
)}</sup> ${weatherData.currentDay}</h3>
`;

//Functie care afiseaza datele in DOM
function renderWeatherDataForToday() {
  currentTemperature.textContent = weatherData.currentTemp;
  degreesMin.textContent = weatherData.todayMin;
  degreesMax.textContent = weatherData.todayMax;
  dateInfo.innerHTML = DayContent;
  sunrise.textContent = weatherData.sunRise;
  sunset.textContent = weatherData.sunSunset;
  currentMonth.textContent = weatherData.currentMonth;
  cityText.innerHTML = `<b>${weatherData.city}, ${weatherData.country}</b>`;

  // Obiect de mapare pentru a asocia codurile de vreme cu iconițele
  const weatherIcons = {
    '01d': sunSvg,
    '01n': sunSvg,
    '02d': cloudsAndSunSvg,
    '03d': cloudySvg,
    '13d': snowSvg,
    '10d': rain,
    '10n': rainNight,
  };

  // Verificare dacă există o iconiță asociată cu codul de vreme și o afișare
  const iconCode = weatherData.icon;
  if (weatherIcons.hasOwnProperty(iconCode)) {
    // Găsim sau creăm elementul pentru iconiță SVG
    if (!weatherType) {
      weatherType = document.createElement('div');
      weatherType.classList.add('weather-icon');
      weatherInfo.prepend(weatherType);
    }

    // Actualizăm conținutul iconului SVG
    weatherType.innerHTML = `<svg width="35" height="35" viewBox="0 0 32 32">${weatherIcons[iconCode]}</svg>`;
  }

  // Ștergem iconurile vechi care depășesc numărul așteptat
  const existingIcons = document.querySelectorAll('.weather-icon');
  if (existingIcons.length > 1) {
    existingIcons.forEach((icon, index) => {
      if (index > 0) {
        icon.remove();
      }
    });
  }
}

async function getWeather() {
  await getCurrentLocationCoord();
  await getWeatherForToday(); // Așteaptă să se finalizeze operațiunea
  await getCityBackground(weatherData.city);
  startClockUpdate();
  startCityClockUpdate(); // Începe actualizarea ceasului orașului
  renderWeatherDataForToday();
}

async function getWeatherForSearchedCity() {
  await getWeatherForCity(); // Așteaptă să se finalizeze operațiunea
  renderWeatherDataForToday();
}

getWeather();

searchForm.addEventListener('submit', submitForm);

export async function submitForm(event) {
  if (event) {
    event.preventDefault();
  }

  if (searchInput.value === '') {
    Notify.info('Enter the city name, please!', {
      position: 'center-center',
    });
    return;
  }

  try {
    if (cityClockUpdater) {
      stopCityClockUpdate();
    }
    weatherData.city = searchInput.value;
    getCityBackground(searchInput.value);
    await getWeatherForSearchedCity();
    stopClockUpdate();
    startCityClockUpdate();
  } catch (err) {
    console.error(`Error: Couldn't get data.`);
  }
}

function getCityBackground(cityName) {
  const requestParameters = `?image_type=photo&category=travel&orientation=horizontal&q=${cityName}&page=1&per_page=10`;
  const bg = document.querySelector('.backgroundImage');
  showLoader();

  fetchImages(requestParameters)
    .then(images => {
      if (images.length > 0) {
        const randomImg = Math.floor(Math.random() * images.length);
        const img = images[randomImg].largeImageURL;
        bg.style.backgroundImage = `url(${img})`;
      } else {
        const fallbackRequestParameters = `?image_type=photo&category=buildings&orientation=horizontal&q=&page=1&per_page=10`;
        fetchImages(fallbackRequestParameters)
          .then(fallbackImages => {
            if (fallbackImages.length > 0) {
              const randomImg = Math.floor(
                Math.random() * fallbackImages.length
              );
              const img = fallbackImages[randomImg].largeImageURL;
              bg.style.backgroundImage = `url(${img})`;
            }
          })
          .catch(handleError);
      }
    })
    .catch(handleError)
    .finally(() => {
      setTimeout(() => {
        hideLoader();
      }, 500);
    });
}

function fetchImages(requestParameters) {
  return fetch(URL + requestParameters + KEY)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => data.hits)
    .catch(error => {
      console.error('Error fetching images:', error);
      throw error;
    });
}

function handleError(error) {
  console.error('Error:', error);
}
