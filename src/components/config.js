// pixabay.com/api config
export const URL = 'https://pixabay.com/api/';
export const KEY = '&key=39735160-014c6c17620a2b57de6626257';

//openweathermap.org/api config
export const API_KEY = '6216a81b549dd86d0e4b82bf256e85c0';
export const city = 'Bucharest';
export const weatherEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

export const baseUrlForTodayWeather = `https://api.openweathermap.org/data/2.5/weather?APPID=${API_KEY}&units=metric&lang=en&q=`;

export const makeUrlForDetectedCityFromCurrentCoord = (latitude, longitude) => {
  return `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
};

export const urlForFiveDaysWeather = (lat, lon) => {
  return `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`;
};

export const urlForCoordinates = () => {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
};

export const urlForCoordinatesForSearchedCity = city => {
  return `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
};
