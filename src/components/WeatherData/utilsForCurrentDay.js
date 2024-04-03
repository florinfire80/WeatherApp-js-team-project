'use strict';

//Functie care afla data curenta
const formatDate = data => {
  const currentDate = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  data.currentDayNumber = currentDate.getDate();
  data.currentDay = dayNames[currentDate.getDay()];
  data.currentMonth = monthNames[currentDate.getMonth()];
};

//Functie care stabileste terminatia datei
function getNumberEnding(number) {
  const lastDigit = number % 10;

  if (number >= 11 && number <= 19) {
    return 'th';
  }

  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function getCurrentTime() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function decodeTime(time) {
  const date = new Date(time * 1000);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function updateClock() {
  const clock = document.querySelector('.time__hour');
  clock.textContent = getCurrentTime();
}

// Funcția care afla ora corespunzătoare fusului orar al orașului căutat
function updateClockWithTimeZone(data) {
  const currentTime = new Date();
  const timezoneDifference = (data.timezone - data.locationTimezone) / 3600;
  const hours = (currentTime.getHours() + timezoneDifference + 24) % 24;
  const formattedHour = String(hours).padStart(2, '0');
  const formattedMin = String(currentTime.getMinutes()).padStart(2, '0');
  const formattedSec = String(currentTime.getSeconds()).padStart(2, '0');

  // Actualizăm elementul HTML care afișează ora curentă
  const clockElement = document.querySelector('.time__hour');
  clockElement.textContent = `${formattedHour}:${formattedMin}:${formattedSec}`;
}

export {
  updateClock,
  getNumberEnding,
  formatDate,
  decodeTime,
  updateClockWithTimeZone,
};
