'use strict';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {
  urlForFiveDaysWeather,
  urlForCoordinates,
  urlForCoordinatesForSearchedCity,
} from '../config.js';

import {
  createCardsMarkup,
  getDailyData,
  moreInfoData,
  createMoreInfoMarkup,
  iconMapping,
} from './utilsForFiveDays.js';

let selectedDay;
const moreInfoCards = document.querySelector('.more-info-container');
const cardsList = document.querySelector('.days-cards');
const sectionTitle = document.querySelector('.five-days-section__title');
const moreInfoContainer = document.querySelector('.more-info-container');
const fiveDaysSectionContainer = document.querySelector('.five-days-section');

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

let city = ' ';
sectionTitle.textContent = city;

//aflare coordonate
const cityCoordinates = async () => {
  const response = await fetch(urlForCoordinates());
  const data = await response.json();
  const coordinates = { lat: data[0].lat, lon: data[0].lon };
  return coordinates;
};

const searchedCityCoordinates = async () => {
  const response = await fetch(
    urlForCoordinatesForSearchedCity(searchInput.value)
  );
  const data = await response.json();
  const coordinates = { lat: data[0].lat, lon: data[0].lon };
  return coordinates;
};

//popularea cardurilor din sectiunea five-days
const getWeatherData = async () => {
  // Verificăm dacă bara de căutare este goală
  if (isSearchInputEmpty()) {
    // Afișare prognoza pentru locația curentă
    await fetchWeatherDataForCurrentLocation();
  }
};

const fetchWeatherDataForCurrentLocation = async () => {
  const { lat, lon } = await cityCoordinates();
  const response = await fetch(urlForFiveDaysWeather(lat, lon));
  const weather = await response.json();
  const dailyData = weather.list.map(item => getDailyData(item));
  cardsList.innerHTML = '';
  dailyData
    .slice(1)
    .forEach(item => createCardsMarkup(item, cardsList, iconMapping));
};

// Apelăm funcția getWeatherData la încărcarea paginii
getWeatherData();

//functie pentru popularea cardurilor more-info
const getMoreInfoData = async () => {
  const { lat, lon } = await cityCoordinates();
  const response = await fetch(urlForFiveDaysWeather(lat, lon));
  const weather = await response.json();

  const moreInfo = [];
  weather.list.forEach(item => {
    moreInfoData(item, moreInfo);
  });
  const dataForDay = moreInfo[selectedDay];
  createMoreInfoMarkup(dataForDay, moreInfoContainer, iconMapping);
};

//event listener pentru a afla pe care buton "more-info" s-a dat click pentru a arata informatii pentru ziua relevanta
cardsList.addEventListener('click', async event => {
  const cardButton = event.target.closest('.card__button');
  if (!cardButton) return;

  const clickedDay = cardButton.value;
  const selectedCard = cardButton.parentElement;
  const isCardSelected = selectedCard.classList.contains('selected');

  // Deselect all cards
  document.querySelectorAll('.card.selected').forEach(card => {
    card.classList.remove('selected');
  });

  if (!isCardSelected || selectedDay !== clickedDay) {
    // Select the clicked card
    selectedCard.classList.add('selected');
    selectedDay = clickedDay;
    moreInfoCards.classList.remove('hidden');
    fiveDaysSectionContainer.style.marginBottom = '400px';
    try {
      await getMoreInfoData();
    } catch (err) {
      console.log(err);
    }
  } else {
    // Deselect the card
    selectedDay = null;
    moreInfoCards.classList.add('hidden');
    fiveDaysSectionContainer.style.marginBottom = '0px';
  }
});

const getCityForecastData = async city => {
  const { lat, lon } = await searchedCityCoordinates(city);
  const response = await fetch(urlForFiveDaysWeather(lat, lon));
  const weather = await response.json();
  const dailyData = [];
  weather.list.forEach(item => {
    getDailyData(item, dailyData);
  });
  cardsList.innerHTML = '';
  dailyData.forEach((item, index) => {
    //aceasta conditie este pentru a elimina ziua curenta, deja este vizibila pe homepage
    if (index === 0) {
      return;
    }
    createCardsMarkup(item, cardsList, iconMapping);
  });
};

function submitForm(event) {
  event.preventDefault();

  if (searchInput.value === '') {
    Notify.info('Enter the city name, please!', {
      position: 'center-center',
    });
    return;
  }

  sectionTitle.textContent = searchInput.value;
  getCityForecastData(searchInput.value);
}

searchForm.addEventListener('submit', submitForm);

// Event listener pentru butonul "five-days"
document
  .getElementById('five-days-button')
  .addEventListener('click', async () => {
    if (isSearchInputEmpty()) {
      // Afișare prognoza pentru locația curentă
      await getWeatherData();
    } else {
      // Afișare prognoza pentru locația introdusă în bara de căutare
      const city = searchInput.value;
      await getCityForecastData(city);
    }
  });
