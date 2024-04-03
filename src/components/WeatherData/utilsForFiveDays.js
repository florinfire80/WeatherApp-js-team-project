'use strict';
import {
  cloudsAndSunSvg,
  cloudySvg,
  snowSvg,
  sunSvg,
  barometerSvg,
  humiditySvg,
  windSvg,
} from './svgConstants';

//functie pentru a formata data la "26 jul" in loc de "26.07.2023"
const formatDate = dateString => {
  const date = new Date(dateString);

  const day = date.getDate();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];

  return `${day} ${month}`;
};

//functie pentru a formata ora
function getHour(dateString) {
  const date = new Date(dateString);
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${hour.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

//functie pentru a determina si a scrie ziua saptamanii in functie de data
const getDayOfWeek = dateString => {
  const date = new Date(dateString);
  const dayOfWeekNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = dayOfWeekNames[date.getDay()];

  return dayOfWeek;
};

//functie pentru a crea markup pentru cardurile five-days
function createCardsMarkup(item, cardsList, iconMapping) {
  const { weatherIconCode, day, dayDate, minTemp, maxTemp } = item;
  const iconSVG = iconMapping[weatherIconCode];

  const cardHTML = `
    <div class="card">
      <h3 class="card__name">${day}</h3>
      <h2 class="card__date">${dayDate}</h2>
      <svg width="35" height="35" class="card__icon" viewBox="0 0 32 32">${iconSVG}</svg>
      <ul class="temperatures">
        <li class="temperatures__item">
          <span class="temperatures__label">min</span>
          ${minTemp}°
        </li>
        <li class="temperatures__item">
          <span class="temperatures__label">max</span>
          ${maxTemp}°
        </li>
      </ul>
      <button class="card__button" value="${dayDate}">more info</button>
    </div>
  `;

  cardsList.insertAdjacentHTML('beforeend', cardHTML);
}

//functie pentru a crea array cu datele pentru o zi la 3 ore
function getDailyData(item, dailyData) {
  const {
    dt_txt,
    main: { temp, temp_min, temp_max },
    weather,
  } = item;
  const date = formatDate(dt_txt);
  const existingData = dailyData.find(data => data.dayDate === date);

  if (!existingData) {
    dailyData.push({
      minTemp: Math.ceil(temp_min),
      maxTemp: Math.ceil(temp_max),
      day: getDayOfWeek(dt_txt),
      dayDate: date,
      weatherIconCode: weather[0].icon,
    });
  } else {
    existingData.minTemp = Math.ceil(Math.min(existingData.minTemp, temp));
    existingData.maxTemp = Math.ceil(Math.max(existingData.maxTemp, temp));
  }
}

//functie pentru a crea arrayul cu datele pe ore pentru fiecare zi
function moreInfoData(item, myarr) {
  const { dt_txt } = item;
  const date = formatDate(dt_txt);
  const hour = getHour(dt_txt);
  const dayData = myarr[date];

  if (!dayData) {
    myarr[date] = [{ hour, ...item }];
  } else {
    const hourData = dayData.find(data => getHour(data.dt_txt) === hour);
    if (!hourData) {
      dayData.push({ hour, ...item });
    }
  }
}

//functie pentru a crea markup pentru cardurile moreInfo
function createMoreInfoMarkup(dataForDay, moreInfoContainer, iconMapping) {
  const markup = dataForDay
    .slice(1)
    .map(item => {
      const { weather, hour, main, wind } = item;
      const iconCode = weather[0].icon;
      const iconSVG = iconMapping[iconCode];

      return `
      <div class="more-info">
        <p class="more-info__hour">${hour}</p>
        <svg width="35" height="35" class="more-info__icon" viewBox="0 0 32 32">${iconSVG}</svg>
        <p class="more-info__temperature">${Math.ceil(main.temp)}°</p>
        <ul class="details-list">
          <li class="details-list__item">
            <svg class="details-list__icon" width="20" height="20" viewBox="0 0 32 32">${barometerSvg}</svg>
            ${main.pressure} mm
          </li>
          <li class="details-list__item">
            <svg class="details-list__icon" width="20" height="20" viewBox="0 0 32 32">${humiditySvg}</svg>
            ${main.humidity}%
          </li>
          <li class="details-list__item">
            <svg class="details-list__icon" width="20" height="20" viewBox="0 0 32 32">${windSvg}</svg>
            ${wind.speed} m/s
          </li>
        </ul>
      </div>`;
    })
    .join('');

  moreInfoContainer.innerHTML = markup;
}

//array care stocheaza valorile pentru icons de pe server pentru a randa icons in functie de raspuns
const iconMapping = {
  '01d': sunSvg,
  '01n': sunSvg,
  '02d': cloudsAndSunSvg,
  '02n': cloudsAndSunSvg,
  '03d': cloudySvg,
  '03n': cloudySvg,
  '04d': cloudySvg,
  '04n': cloudySvg,
  '09d': cloudySvg,
  '09n': cloudySvg,
  '10d': cloudySvg,
  '10n': cloudySvg,
  '11d': cloudySvg,
  '11n': cloudySvg,
  '13d': snowSvg,
  '13n': snowSvg,
  '50d': cloudsAndSunSvg,
  '50n': cloudsAndSunSvg,
};
export {
  formatDate,
  getDayOfWeek,
  createCardsMarkup,
  getDailyData,
  moreInfoData,
  createMoreInfoMarkup,
  iconMapping,
};
