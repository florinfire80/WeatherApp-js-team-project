import axios from 'axios';
import { weatherEndpoint } from '../config.js';

function generateLabels(dataList) {
  return dataList.slice(0, 5).map(item => {
    const date = new Date(item.dt * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month}/${year} ${hours}:${
      minutes < 10 ? '0' : ''
    }${minutes}`;
  });
}

async function getWeatherData() {
  try {
    const response = await axios.get(weatherEndpoint);

    const weatherData = response.data.list
      .slice(0, 5)
      .map(item => item.main.temp);

    const labels = generateLabels(response.data.list);

    return { weatherData, labels };
  } catch (error) {
    console.error('Error getting weather data:', error);
    return null;
  }
}

//Utilizare umiditate

async function getHumidityData() {
  try {
    const response = await axios.get(weatherEndpoint);

    const humidityData = response.data.list
      .slice(0, 5)
      .map(item => item.main.humidity);

    const labels = generateLabels(response.data.list);

    return { humidityData, labels };
  } catch (error) {
    console.error('Error getting humidity data:', error);
    return null;
  }
}

//Utilizare viteza vantului

async function getWindData() {
  try {
    const response = await axios.get(weatherEndpoint);

    const windData = response.data.list
      .slice(0, 5)
      .map(item => item.wind.speed);

    const labels = generateLabels(response.data.list);

    return { windData, labels };
  } catch (error) {
    console.error('Error getting wind speed data:', error);
    return null;
  }
}

//Utilizare atmosferei

async function getAtmosphereData() {
  try {
    const response = await axios.get(weatherEndpoint);

    const atmosphereData = response.data.list
      .slice(0, 5)
      .map(item => item.main.pressure);

    const labels = generateLabels(response.data.list);

    return { atmosphereData, labels };
  } catch (error) {
    console.error('Error getting atmospheric pressure data:', error);
    return null;
  }
}

// Functia de generare CHART

async function generateWeatherChart() {
  const weatherData = await getWeatherData();
  const humidityData = await getHumidityData();
  const windData = await getWindData();
  const atmosphereData = await getAtmosphereData();
  if (weatherData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chartFont = () => {
      if (window.innerWidth < 480) {
        return 12;
      } else {
        return 18;
      }
    };
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: weatherData.labels,
        datasets: [
          {
            label: 'Temperature',
            data: weatherData.weatherData,
            borderColor: 'rgb(255, 107, 9)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Humidity',
            data: humidityData.humidityData,
            borderColor: 'rgb(9, 6, 235)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Wind Speed',
            data: windData.windData,
            borderColor: 'rgb(234, 154, 5)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Atmosphere pressure',
            data: atmosphereData.atmosphereData,
            borderColor: 'rgb(6, 120, 6)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              color: 'rgb(100, 100, 100)',
            },
            ticks: {
              color: 'rgb(100, 100, 100)',
            },
            title: {
              display: true,
              text: 'Date[dd/mm/yyyy - hour/minutes]',
              color: 'rgb(100, 100, 100)',
              font: {
                size: chartFont(),
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgb(100, 100, 100)',
            },
            ticks: {
              color: 'rgb(100, 100, 100)',
            },
            title: {
              display: true,
              text: 'Value of Indicators',
              color: 'rgb(100, 100, 100)',
              font: {
                size: chartFont(),
              },
            },
          },
        },
      },
    });
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.classList.add('hidden');

    localStorage.setItem('chartContainerActivated', 'false');
  }
}

window.addEventListener('resize', () => {
  myChart.options.scales.x.ticks.font.size = chartFont();
  myChart.options.scales.y.ticks.font.size = chartFont();
  myChart.update();
});

generateWeatherChart();

//Evenimente pentru functionalitatile graficului

const chartCanvas = document.getElementById('myChart');
const toggleButton = document.getElementById('chartButton');

window.addEventListener('load', function () {
  const chartState = localStorage.getItem('chartContainerActivated');

  if (chartState === 'true') {
    chartCanvas.style.display = 'block';
    toggleButton.innerText = 'Hide Chart';
  } else {
    chartCanvas.style.display = 'none';
    toggleButton.innerText = 'Show Chart';
  }
});

toggleButton.addEventListener('click', function (event) {
  event.preventDefault();
  if (chartCanvas.style.display === 'none') {
    chartCanvas.style.display = 'block';
    toggleButton.innerText = 'Hide Chart';
    localStorage.setItem('chartContainerActivated', 'false');
  } else {
    chartCanvas.style.display = 'none';
    toggleButton.innerText = 'Show Chart';
    localStorage.setItem('chartContainerActivated', 'true');
  }
});

chartCanvas.style.display = 'none';

// Aparitia si Disparitia graficului in functie de pagina din browser

function activateChartContainer() {
  var chartContainer = document.querySelector('.chart-container');

  if (chartContainer) {
    chartContainer.classList.remove('hidden');
    localStorage.setItem('chartContainerActivated', 'true');

    var toggleButton = document.getElementById('chartButton');
    toggleButton.innerText = 'Show Chart';
  }
}

// Aparitia si Disparitia graficului in functie de pagina

var activateButton = document.getElementById('5-days-button');
activateButton.addEventListener('click', activateChartContainer);

function deactivateChartContainer() {
  var chartContainer = document.querySelector('.chart-container');
  if (chartContainer) {
    chartContainer.classList.add('hidden');
    localStorage.setItem('chartContainerDeactivated', 'true');
  }
}

var deactivateButton = document.getElementById('today-button');
deactivateButton.addEventListener('click', deactivateChartContainer);
