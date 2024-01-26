'use strict';
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
  const iconCode = item.weatherIconCode;
  const iconSVG = iconMapping[iconCode];
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
      <h3 class="card__name">${item.day}</h3>
      <h2 class="card__date">${item.dayDate}</h2>
      <svg width="35" height="35" class="card__icon "viewBox="0 0 32 32"
${iconSVG}
      ></svg>
      <ul class="temperatures">
        <li class="temperatures__item">
          <span class="temperatures__label">min</span>
          ${item.minTemp}°
        </li>
        <li class="temperatures__item">
          <span class="temperatures__label">max</span>
          ${item.maxTemp}°
        </li>
      </ul>
      <button class="card__button" value="${item.dayDate}">more info</button>
    `;

  cardsList.appendChild(card);
}
//functie pentru a creea array cu datele pentru o zi (cele mai mari valori din datele primite la fiecare interval de 3 ore)
function getDailyData(item, dailyData) {
  const date = formatDate(item.dt_txt);
  const existingData = dailyData.find(data => data.dayDate === date);

  if (!existingData) {
    dailyData.push({
      minTemp: Math.ceil(item.main.temp_min),
      maxTemp: Math.ceil(item.main.temp_max),
      day: getDayOfWeek(item.dt_txt),
      dayDate: date,
      weatherIconCode: item.weather[0].icon,
    });
  } else {
    if (item.main.temp < existingData.minTemp) {
      existingData.minTemp = Math.ceil(item.main.temp);
    }
    if (item.main.temp > existingData.maxTemp) {
      existingData.maxTemp = Math.ceil(item.main.temp);
    }
  }
}
//functie pentru a crea arrayul cu datele pe ore pentru fiecare zi
function moreInfoData(item, myarr) {
  const date = formatDate(item.dt_txt);
  const hour = getHour(item.dt_txt);
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
  let markup = '';
  dataForDay.forEach((item, index) => {
    if (index === 0) {
      return;
    }
    const iconCode = item.weather[0].icon;
    const iconSVG = iconMapping[iconCode];
    markup += ` <div class="more-info">
     <p class="more-info__hour">${item.hour}</p>
        <svg width="35" height="35" class="more-info__icon" viewBox="0 0 32 32" ${iconSVG}>          
        </svg>
        <p class="more-info__temperature">${Math.ceil(item.main.temp)}°</p>
        <ul class="details-list">
          <li class="details-list__item">
            <svg class="details-list__icon" width="20" height="20" viewBox="0 0 32 32" ${barometerSvg}>
                       
            </svg>
            ${item.main.pressure} mm
          </li>
          <li class="details-list__item">
            <svg class="details-list__icon" width="20" height="20" viewBox="0 0 32 32" ${humiditySvg}>
                        
            </svg>
            ${item.main.humidity}%
          </li>
          <li class="details-list__item">
            <svg class="details-list__icon" width="20" height="20" viewBox="0 0 32 32" ${windSvg}>
                        
            </svg>
            ${item.wind.speed} m/s
          </li>
        </ul>
        </div>`;
  });
  moreInfoContainer.innerHTML = markup;
}
//svg-uri
const cloudsAndSunSvg = `<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M19.218 21.205c-3.847 0-6.995-3.112-7.030-6.967-0.036-3.877 3.090-7.060 6.967-7.096 0.022-0 0.044-0 0.066-0 3.847 0 6.995 3.112 7.030 6.967 0.036 3.877-3.090 7.060-6.966 7.096-0.022 0-0.044 0-0.065 0z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M19.22 7.142c-0 0-0.001 0-0.001 0v14.063c0.021 0 0.043-0 0.065-0 3.877-0.036 7.002-3.219 6.966-7.096-0.035-3.855-3.183-6.967-7.030-6.967z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M19.246 5.806c-0.514 0-0.933-0.414-0.937-0.929l-0.023-2.538c-0.005-0.518 0.411-0.941 0.929-0.946h0.009c0.514 0 0.932 0.414 0.937 0.929l0.023 2.538c0.005 0.518-0.411 0.941-0.929 0.946-0.003 0-0.006 0-0.009 0z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M28.525 15.026c-0.514 0-0.932-0.414-0.937-0.929-0.005-0.518 0.411-0.941 0.929-0.946l2.547-0.023c0.514 0 0.933 0.414 0.937 0.929 0.005 0.518-0.411 0.941-0.929 0.946l-2.538 0.023c-0.003 0-0.006 0-0.009 0z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M25.851 8.471c-0.237 0-0.474-0.089-0.657-0.268-0.369-0.363-0.375-0.956-0.012-1.326l1.778-1.811c0.363-0.369 0.956-0.375 1.326-0.012s0.375 0.956 0.012 1.326l-1.778 1.811c-0.183 0.187-0.426 0.281-0.669 0.281z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M12.691 8.592c-0.237 0-0.474-0.089-0.657-0.268l-1.811-1.778c-0.369-0.363-0.375-0.956-0.012-1.326s0.956-0.375 1.326-0.012l1.811 1.778c0.369 0.363 0.375 0.956 0.012 1.326-0.184 0.187-0.426 0.281-0.669 0.281z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M22.824 6.486c-0.117 0-0.236-0.022-0.352-0.069-0.48-0.194-0.712-0.741-0.517-1.221l0.952-2.352c0.194-0.48 0.741-0.711 1.221-0.517s0.712 0.741 0.517 1.221l-0.952 2.352c-0.148 0.365-0.499 0.586-0.869 0.586z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M30.31 19.556c-0.117 0-0.236-0.022-0.351-0.069l-2.352-0.952c-0.48-0.194-0.712-0.741-0.517-1.221s0.741-0.712 1.221-0.517l2.352 0.952c0.48 0.194 0.712 0.741 0.517 1.221-0.148 0.365-0.499 0.586-0.869 0.586z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M10.706 11.619c-0.117 0-0.236-0.022-0.351-0.069l-2.352-0.952c-0.48-0.194-0.712-0.741-0.517-1.221s0.741-0.711 1.221-0.517l2.352 0.952c0.48 0.194 0.712 0.741 0.517 1.221-0.148 0.365-0.499 0.586-0.869 0.586z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M27.901 11.482c-0.365 0-0.712-0.215-0.864-0.572-0.202-0.477 0.021-1.027 0.498-1.229l2.337-0.99c0.477-0.202 1.027 0.021 1.229 0.498s-0.021 1.027-0.498 1.229l-2.337 0.99c-0.119 0.050-0.243 0.074-0.365 0.074z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M15.702 6.543c-0.365 0-0.712-0.215-0.864-0.572l-0.99-2.337c-0.202-0.477 0.021-1.027 0.497-1.229s1.027 0.021 1.229 0.498l0.99 2.337c0.202 0.477-0.021 1.027-0.498 1.229-0.119 0.051-0.243 0.075-0.365 0.075z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M13.937 30.607c-1.111 0-2.197-0.383-3.060-1.080-0.459-0.37-0.845-0.82-1.141-1.323-0.64 0.401-1.389 0.623-2.159 0.623-1.824 0-3.393-1.22-3.897-2.905-0.848-0.081-1.658-0.427-2.307-1.001-0.873-0.771-1.374-1.882-1.374-3.047 0-2.116 1.624-3.86 3.692-4.049 0.209-0.676 0.593-1.291 1.123-1.782 0.754-0.698 1.735-1.083 2.763-1.083 0.764 0 1.506 0.218 2.143 0.613 0.295-0.509 0.682-0.965 1.144-1.34 0.865-0.704 1.957-1.091 3.074-1.091s2.209 0.388 3.074 1.091c0.461 0.375 0.848 0.831 1.144 1.34 0.637-0.394 1.379-0.613 2.143-0.613 1.028 0 2.009 0.384 2.763 1.083 0.53 0.491 0.914 1.105 1.123 1.782 0.852 0.079 1.665 0.425 2.317 1.001 0.874 0.771 1.375 1.882 1.375 3.048s-0.501 2.276-1.374 3.047c-0.649 0.573-1.459 0.919-2.307 1.001-0.504 1.684-2.073 2.905-3.897 2.905-0.771 0-1.519-0.222-2.159-0.623-0.296 0.503-0.683 0.953-1.141 1.323-0.863 0.697-1.95 1.080-3.060 1.080z"></path>
<path fill="#f6efea" style="fill: var(--color7, #f6efea)" d="M26.5 18.827c-0.652-0.575-1.465-0.921-2.317-1.001-0.209-0.677-0.593-1.291-1.123-1.782-0.754-0.698-1.735-1.083-2.763-1.083-0.764 0-1.506 0.218-2.143 0.613-0.295-0.509-0.682-0.965-1.144-1.34-0.865-0.704-1.957-1.091-3.074-1.091v17.464c1.111 0 2.197-0.384 3.060-1.080 0.459-0.37 0.845-0.82 1.141-1.323 0.64 0.401 1.389 0.623 2.159 0.623 1.824 0 3.393-1.22 3.897-2.905 0.848-0.081 1.658-0.427 2.307-1.001 0.873-0.771 1.374-1.882 1.374-3.047s-0.501-2.277-1.375-3.048z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M20.16 2.322c-0.005-0.515-0.423-0.929-0.937-0.929-0.001 0-0.003 0-0.004 0v4.411c0.009 0 0.018 0.001 0.028 0.001h0.009c0.518-0.005 0.934-0.428 0.929-0.946l-0.023-2.538z"></path>
`;
const cloudySvg = `<path fill="#eee1dc" style="fill: var(--color4, #eee1dc)" d="M26.888 20.96c-3.317 0-11.015-2.423-14.428-5.445-1.259-1.114-1.897-2.262-1.897-3.411 0-2.55 2.075-4.625 4.625-4.625 0.437 0 0.868 0.061 1.283 0.181 0.626-1.821 2.352-3.114 4.374-3.114 1.671 0 3.199 0.909 4.013 2.325 0.131-0.011 0.262-0.017 0.393-0.017 2.55 0 4.625 2.075 4.625 4.625 0 0.3-0.028 0.596-0.085 0.886 1.349 0.831 2.21 2.324 2.21 3.944 0 1.215-0.489 2.35-1.377 3.194-0.81 0.77-1.923 1.276-3.134 1.424-0.179 0.022-0.38 0.033-0.601 0.033z"></path>
<path fill="#e0d2cd" style="fill: var(--color5, #e0d2cd)" d="M29.79 12.366c0.056-0.29 0.085-0.586 0.085-0.886 0-2.55-2.075-4.625-4.625-4.625-0.131 0-0.263 0.006-0.393 0.017-0.743-1.292-2.079-2.161-3.576-2.304v15.323c2.204 0.673 4.264 1.070 5.607 1.070 0.22 0 0.421-0.011 0.601-0.033 1.211-0.148 2.324-0.654 3.134-1.424 0.888-0.845 1.377-1.979 1.377-3.194 0-1.619-0.861-3.113-2.21-3.944z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M13.321 27.454c-1.068 0-2.113-0.369-2.943-1.039-0.429-0.346-0.792-0.766-1.074-1.233-0.608 0.371-1.315 0.576-2.042 0.576-1.747 0-3.251-1.162-3.746-2.77-0.806-0.083-1.575-0.416-2.193-0.961-0.841-0.743-1.323-1.813-1.323-2.936 0-2.029 1.55-3.702 3.527-3.898 0.203-0.641 0.57-1.222 1.073-1.688 0.726-0.673 1.671-1.043 2.662-1.043 0.72 0 1.421 0.202 2.026 0.567 0.281-0.473 0.645-0.898 1.077-1.25 0.832-0.677 1.882-1.050 2.956-1.050s2.124 0.373 2.956 1.050c0.432 0.351 0.796 0.776 1.077 1.25 0.605-0.365 1.305-0.567 2.026-0.567 0.99 0 1.936 0.371 2.662 1.043 0.503 0.466 0.87 1.048 1.073 1.689 0.81 0.082 1.582 0.414 2.203 0.961 0.842 0.743 1.325 1.813 1.325 2.937s-0.482 2.193-1.324 2.936c-0.618 0.546-1.386 0.878-2.193 0.961-0.494 1.608-1.999 2.77-3.746 2.77-0.727 0-1.433-0.205-2.042-0.576-0.282 0.468-0.645 0.887-1.074 1.233-0.83 0.67-1.875 1.039-2.943 1.039z"></path>
<path fill="#f6efea" style="fill: var(--color7, #f6efea)" d="M25.317 16.155c-0.62-0.547-1.393-0.88-2.203-0.961-0.203-0.641-0.57-1.223-1.073-1.689-0.726-0.673-1.671-1.043-2.662-1.043-0.72 0-1.421 0.202-2.026 0.567-0.281-0.473-0.645-0.898-1.077-1.25-0.832-0.677-1.882-1.050-2.956-1.050v16.725c1.068 0 2.113-0.369 2.943-1.039 0.429-0.346 0.792-0.766 1.074-1.233 0.608 0.371 1.315 0.576 2.042 0.576 1.747 0 3.251-1.162 3.746-2.77 0.806-0.083 1.575-0.416 2.193-0.961 0.841-0.743 1.324-1.813 1.324-2.936s-0.483-2.194-1.325-2.937z"></path>
`;
const snowSvg = `<path fill="#7dd5f4" style="fill: var(--color10, #7dd5f4)" d="M19.531 28.438c0-0.518-0.42-0.938-0.938-0.938h-0.33l0.234-0.234c0.366-0.366 0.366-0.96 0-1.326s-0.96-0.366-1.326 0l-0.234 0.234v-0.362c0-0.518-0.42-0.937-0.938-0.937s-0.938 0.42-0.938 0.937v0.362l-0.256-0.256c-0.366-0.366-0.96-0.366-1.326 0s-0.366 0.96 0 1.326l0.256 0.256h-0.33c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938h0.33l-0.234 0.234c-0.366 0.366-0.366 0.96 0 1.326 0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.092 0.663-0.275l0.234-0.234v0.362c0 0.518 0.42 0.938 0.938 0.938s0.938-0.42 0.938-0.938v-0.362l0.256 0.256c0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.092 0.663-0.275c0.366-0.366 0.366-0.96 0-1.326l-0.256-0.256h0.33c0.518 0 0.938-0.42 0.938-0.938z"></path>
<path fill="#7dd5f4" style="fill: var(--color10, #7dd5f4)" d="M7.063 22.5c0-0.518-0.42-0.938-0.938-0.938h-0.33l0.234-0.234c0.366-0.366 0.366-0.96 0-1.326s-0.96-0.366-1.326 0l-0.234 0.234v-0.362c0-0.518-0.42-0.938-0.938-0.938s-0.938 0.42-0.938 0.938v0.362l-0.256-0.256c-0.366-0.366-0.96-0.366-1.326 0s-0.366 0.96 0 1.326l0.256 0.256h-0.331c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938h0.33l-0.234 0.234c-0.366 0.366-0.366 0.96 0 1.326 0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.091 0.663-0.275l0.234-0.234v0.362c0 0.518 0.42 0.938 0.938 0.938s0.938-0.42 0.938-0.938v-0.362l0.256 0.256c0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.092 0.663-0.275c0.366-0.366 0.366-0.96 0-1.326l-0.256-0.256h0.33c0.518 0 0.938-0.42 0.938-0.938z"></path>
<path fill="#4793ff" style="fill: var(--color11, #4793ff)" d="M32 22.5c0-0.518-0.42-0.938-0.938-0.938h-0.33l0.234-0.234c0.366-0.366 0.366-0.96 0-1.326s-0.96-0.366-1.326 0l-0.234 0.234v-0.362c0-0.518-0.42-0.938-0.938-0.938s-0.938 0.42-0.938 0.938v0.362l-0.256-0.256c-0.366-0.366-0.96-0.366-1.326 0s-0.366 0.96 0 1.326l0.256 0.256h-0.33c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938h0.33l-0.234 0.234c-0.366 0.366-0.366 0.96 0 1.326 0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.091 0.663-0.275l0.234-0.234v0.362c0 0.518 0.42 0.938 0.938 0.938s0.938-0.42 0.938-0.938v-0.362l0.256 0.256c0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.092 0.663-0.275c0.366-0.366 0.366-0.96 0-1.326l-0.256-0.256h0.33c0.518 0 0.938-0.42 0.938-0.938z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M10.781 23.375c0.516 0 0.938-0.421 0.938-0.938s-0.421-0.938-0.938-0.938-0.938 0.421-0.938 0.938c0 0.516 0.421 0.938 0.938 0.938z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M21.219 23.375c0.516 0 0.938-0.421 0.938-0.938s-0.421-0.938-0.938-0.938-0.938 0.421-0.938 0.938c0 0.516 0.421 0.938 0.938 0.938z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M5.688 32c0.516 0 0.938-0.421 0.938-0.938s-0.421-0.938-0.938-0.938c-0.516 0-0.938 0.421-0.938 0.938s0.421 0.938 0.938 0.938z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M26.313 32c0.516 0 0.938-0.421 0.938-0.938s-0.421-0.938-0.938-0.938c-0.516 0-0.938 0.421-0.938 0.938s0.421 0.938 0.938 0.938z"></path>
<path fill="#fff4f4" style="fill: var(--color6, #fff4f4)" d="M16 19.938c-1.253 0-2.479-0.433-3.452-1.218-0.558-0.45-1.021-1.006-1.364-1.628-0.746 0.503-1.635 0.784-2.553 0.784-2.081 0-3.867-1.416-4.4-3.356-0.988-0.073-1.935-0.466-2.689-1.131-0.98-0.865-1.541-2.111-1.541-3.419 0-2.408 1.875-4.386 4.242-4.551 0.227-0.797 0.669-1.521 1.288-2.095 0.846-0.783 1.947-1.215 3.1-1.215 0.91 0 1.792 0.276 2.535 0.772 0.342-0.629 0.806-1.191 1.367-1.648 0.976-0.794 2.208-1.231 3.468-1.231s2.492 0.437 3.468 1.231c0.561 0.456 1.025 1.019 1.367 1.648 0.743-0.496 1.625-0.772 2.535-0.772 1.153 0 2.254 0.431 3.1 1.215 0.62 0.574 1.062 1.298 1.288 2.096 0.992 0.070 1.943 0.463 2.699 1.131 0.98 0.865 1.543 2.112 1.543 3.42s-0.562 2.553-1.541 3.419c-0.754 0.666-1.701 1.059-2.689 1.131-0.533 1.94-2.319 3.356-4.4 3.356-0.917 0-1.806-0.28-2.553-0.784-0.343 0.622-0.806 1.177-1.364 1.628-0.973 0.786-2.199 1.218-3.452 1.218z"></path>
<path fill="#f6efea" style="fill: var(--color7, #f6efea)" d="M30.457 6.549c-0.757-0.668-1.708-1.061-2.699-1.131-0.227-0.797-0.669-1.522-1.288-2.096-0.846-0.783-1.947-1.215-3.1-1.215-0.91 0-1.792 0.276-2.535 0.772-0.342-0.629-0.805-1.191-1.366-1.648-0.976-0.794-2.208-1.231-3.468-1.231v19.937c1.253 0 2.479-0.433 3.452-1.218 0.558-0.45 1.021-1.006 1.365-1.628 0.746 0.503 1.635 0.784 2.553 0.784 2.081 0 3.867-1.416 4.4-3.356 0.988-0.073 1.935-0.466 2.689-1.131 0.979-0.865 1.541-2.111 1.541-3.419s-0.562-2.555-1.543-3.42z"></path>
<path fill="#4793ff" style="fill: var(--color11, #4793ff)" d="M19.531 28.438c0-0.518-0.42-0.938-0.938-0.938h-0.33l0.234-0.234c0.366-0.366 0.366-0.96 0-1.326s-0.96-0.366-1.326 0l-0.234 0.234v-0.362c0-0.518-0.42-0.937-0.938-0.937v7.125c0.518 0 0.938-0.42 0.938-0.938v-0.362l0.256 0.256c0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.092 0.663-0.275c0.366-0.366 0.366-0.96 0-1.326l-0.256-0.256h0.33c0.518 0 0.938-0.42 0.938-0.937z"></path>
`;
const sunSvg = `<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M16 24.688c-4.79 0-8.688-3.897-8.688-8.688s3.897-8.688 8.688-8.688c4.79 0 8.688 3.897 8.688 8.688s-3.897 8.688-8.688 8.688z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M16 5.103c-0.518 0-0.938-0.42-0.938-0.938v-3.228c0-0.518 0.42-0.938 0.938-0.938s0.938 0.42 0.938 0.938v3.228c0 0.518-0.42 0.938-0.938 0.938z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M31.063 16.938h-3.228c-0.518 0-0.938-0.42-0.938-0.938s0.42-0.938 0.938-0.938h3.228c0.518 0 0.938 0.42 0.938 0.938s-0.42 0.938-0.938 0.938z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M16 32c-0.518 0-0.938-0.42-0.938-0.938v-3.228c0-0.518 0.42-0.938 0.938-0.938s0.938 0.42 0.938 0.938v3.228c0 0.518-0.42 0.938-0.938 0.938z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M4.165 16.938h-3.228c-0.518 0-0.938-0.42-0.938-0.938s0.42-0.938 0.938-0.938h3.228c0.518 0 0.938 0.42 0.938 0.938s-0.42 0.938-0.938 0.938z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M24.369 8.569c-0.24 0-0.48-0.091-0.663-0.275-0.366-0.366-0.366-0.96 0-1.326l2.282-2.282c0.366-0.366 0.96-0.366 1.326 0s0.366 0.96 0 1.326l-2.282 2.282c-0.183 0.183-0.423 0.275-0.663 0.275z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M26.651 27.588c-0.24 0-0.48-0.092-0.663-0.275l-2.282-2.282c-0.366-0.366-0.366-0.96 0-1.326s0.96-0.366 1.326 0l2.282 2.282c0.366 0.366 0.366 0.96 0 1.326-0.183 0.183-0.423 0.275-0.663 0.275z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M5.349 27.588c-0.24 0-0.48-0.092-0.663-0.275-0.366-0.366-0.366-0.96 0-1.326l2.282-2.282c0.366-0.366 0.96-0.366 1.326 0s0.366 0.96 0 1.326l-2.282 2.282c-0.183 0.183-0.423 0.275-0.663 0.275z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M7.631 8.569c-0.24 0-0.48-0.091-0.663-0.275l-2.282-2.282c-0.366-0.366-0.366-0.96 0-1.326s0.96-0.366 1.326 0l2.282 2.282c0.366 0.366 0.366 0.96 0 1.326-0.183 0.183-0.423 0.275-0.663 0.275z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M20.541 6.009c-0.12 0-0.242-0.023-0.359-0.072-0.478-0.199-0.705-0.747-0.506-1.226l1.239-2.981c0.199-0.478 0.748-0.705 1.226-0.506s0.705 0.747 0.506 1.226l-1.239 2.981c-0.15 0.36-0.499 0.578-0.866 0.578z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M29.909 22.718c-0.12 0-0.242-0.023-0.36-0.072l-2.98-1.239c-0.478-0.199-0.705-0.747-0.506-1.226s0.747-0.705 1.226-0.506l2.981 1.239c0.478 0.199 0.705 0.747 0.506 1.225-0.15 0.36-0.499 0.578-0.866 0.578z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M10.219 30.847c-0.12 0-0.242-0.023-0.36-0.072-0.478-0.199-0.705-0.747-0.506-1.225l1.239-2.981c0.199-0.478 0.747-0.705 1.226-0.506s0.705 0.747 0.506 1.226l-1.239 2.98c-0.15 0.36-0.499 0.578-0.866 0.578z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M5.071 12.396c-0.12 0-0.242-0.023-0.359-0.072l-2.981-1.239c-0.478-0.199-0.705-0.747-0.506-1.226s0.747-0.704 1.226-0.506l2.981 1.239c0.478 0.199 0.705 0.747 0.506 1.226-0.15 0.361-0.499 0.578-0.866 0.578z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M26.94 12.421c-0.368 0-0.718-0.219-0.867-0.58-0.198-0.479 0.030-1.027 0.509-1.224l2.983-1.232c0.478-0.197 1.027 0.030 1.224 0.509s-0.030 1.027-0.509 1.224l-2.983 1.232c-0.117 0.048-0.238 0.071-0.357 0.071z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M21.748 30.861c-0.368 0-0.718-0.218-0.867-0.58l-1.232-2.983c-0.198-0.479 0.030-1.027 0.509-1.224s1.027 0.030 1.224 0.509l1.232 2.983c0.198 0.479-0.030 1.027-0.509 1.224-0.117 0.048-0.238 0.071-0.357 0.071z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M2.078 22.685c-0.368 0-0.718-0.218-0.867-0.58-0.198-0.479 0.030-1.027 0.509-1.224l2.983-1.232c0.479-0.198 1.027 0.030 1.224 0.509s-0.030 1.027-0.509 1.224l-2.983 1.232c-0.117 0.048-0.238 0.071-0.357 0.071z"></path>
<path fill="#fdbf00" style="fill: var(--color8, #fdbf00)" d="M11.484 5.999c-0.368 0-0.718-0.218-0.867-0.58l-1.232-2.983c-0.198-0.479 0.030-1.027 0.509-1.224s1.027 0.030 1.224 0.509l1.232 2.983c0.198 0.479-0.030 1.027-0.509 1.224-0.117 0.048-0.238 0.071-0.357 0.071z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M16 0v5.103c0.518 0 0.938-0.42 0.938-0.938v-3.228c0-0.518-0.42-0.938-0.938-0.938z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M16 7.313v17.375c4.79 0 8.688-3.897 8.688-8.688s-3.897-8.688-8.688-8.688z"></path>
<path fill="#ff8856" style="fill: var(--color9, #ff8856)" d="M16 26.897v5.103c0.518 0 0.938-0.42 0.938-0.938v-3.228c0-0.518-0.42-0.938-0.938-0.938z"></path>
`;
const barometerSvg = `<path d="M18.489 4.12c0.206-0.391 0.324-0.836 0.324-1.308 0-1.551-1.262-2.813-2.813-2.813s-2.813 1.262-2.813 2.813c0 0.472 0.117 0.917 0.324 1.308-6.564 1.178-11.561 6.931-11.561 13.829 0 7.747 6.303 14.050 14.050 14.050s14.050-6.303 14.050-14.050c0-6.898-4.997-12.651-11.561-13.829zM16 1.875c0.517 0 0.938 0.421 0.938 0.938s-0.421 0.938-0.938 0.938c-0.517 0-0.938-0.421-0.938-0.938s0.421-0.938 0.938-0.938zM16 30.125c-6.713 0-12.175-5.462-12.175-12.175s5.462-12.175 12.175-12.175c6.713 0 12.175 5.462 12.175 12.175s-5.462 12.175-12.175 12.175z"></path>
<path d="M23.332 10.69c-0.013-0.015-0.026-0.030-0.040-0.044s-0.031-0.029-0.047-0.042c-1.866-1.84-4.426-2.978-7.245-2.978-2.832 0-5.4 1.146-7.267 2.998-0.008 0.008-0.017 0.014-0.025 0.022-0.007 0.007-0.012 0.014-0.019 0.020-1.862 1.869-3.014 4.444-3.014 7.284 0 0.518 0.42 0.938 0.938 0.938h1.063c0.518 0 0.938-0.42 0.938-0.938s-0.42-0.938-0.938-0.938h-0.073c0.181-1.631 0.828-3.124 1.805-4.342l0.052 0.052c0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.091 0.663-0.275c0.366-0.366 0.366-0.96 0-1.326l-0.050-0.051c1.215-0.971 2.703-1.614 4.328-1.794v0.073c0 0.518 0.42 0.938 0.937 0.938s0.938-0.42 0.938-0.938v-0.073c1.625 0.18 3.112 0.824 4.327 1.795l-0.050 0.050c-0.366 0.366-0.366 0.96 0 1.326 0.183 0.183 0.423 0.275 0.663 0.275s0.48-0.092 0.663-0.275l0.051-0.051c0.975 1.214 1.621 2.703 1.804 4.329h-0.084c-0.518 0-0.938 0.42-0.938 0.937s0.42 0.938 0.938 0.938c0 0 1.076-0 1.076-0 0.518-0.001 0.937-0.421 0.936-0.939-0.004-2.822-1.147-5.383-2.993-7.246z"></path>
<path d="M20.251 13.698c-0.366-0.366-0.96-0.366-1.326 0l-3.915 3.915c-0.433-0.207-0.917-0.303-1.407-0.268-0.516 0.036-0.906 0.484-0.87 1s0.484 0.906 1.001 0.87c0.271-0.019 0.536 0.080 0.728 0.272 0.189 0.189 0.288 0.45 0.273 0.717-0.030 0.517 0.365 0.96 0.882 0.99 0.018 0.001 0.037 0.002 0.055 0.002 0.493 0 0.906-0.385 0.935-0.883 0.028-0.478-0.069-0.95-0.271-1.374l3.915-3.915c0.366-0.366 0.366-0.96 0-1.326z"></path>
<path d="M21.375 24.688h-10.75c-0.518 0-0.938 0.42-0.938 0.937s0.42 0.938 0.938 0.938h10.75c0.518 0 0.938-0.42 0.938-0.938s-0.42-0.937-0.938-0.937z"></path>
`;
const humiditySvg = `<g clip-path="url(#clip0_103_566)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.8877 5.87409C17.5148 5.23588 17.1162 4.63252 16.7652 4.17506C16.2479 3.50068 15.9424 3.26165 15.5976 3.26165C15.2708 3.26165 15.005 3.49056 14.7065 3.83427C14.4867 4.08736 14.2247 4.4383 13.9488 4.849C13.5536 5.43756 13.174 6.07944 12.8495 6.70225C12.5018 6.03577 12.1768 5.46139 11.9366 5.05018C11.1847 3.76353 10.3829 2.54946 9.67875 1.63153C8.52394 0.126094 8.08976 0 7.77347 0C7.45718 0 7.02299 0.126094 5.86811 1.63157C5.16396 2.5495 4.36212 3.76357 3.61032 5.05022C2.70684 6.59635 0.605469 10.4497 0.605469 12.832C0.605469 16.7845 3.82103 20 7.77347 20C11.4819 20 14.5415 17.1692 14.9052 13.5551C15.1325 13.597 15.3638 13.6189 15.5976 13.6189C17.6913 13.6189 19.3946 11.9156 19.3946 9.82191C19.3946 8.63074 18.4505 6.83718 17.8877 5.87409ZM7.77347 18.8281C4.4672 18.8281 1.77735 16.1383 1.77735 12.832C1.77735 11.4363 2.77708 8.85824 4.45166 5.93592C5.94639 3.32751 7.27905 1.65028 7.77347 1.23668C8.26788 1.65028 9.60051 3.32747 11.0952 5.93592C12.7698 8.85828 13.7696 11.4363 13.7696 12.832C13.7696 16.1383 11.0797 18.8281 7.77347 18.8281ZM15.5976 12.447C15.3657 12.447 15.1374 12.4166 14.9164 12.3574C14.7873 11.0661 14.1754 9.46101 13.5067 8.02948C14.1582 6.5744 15.1249 5.14057 15.5971 4.59349C15.8953 4.93717 16.4234 5.66143 17.0108 6.69995C17.7697 8.04167 18.2227 9.20875 18.2227 9.82191C18.2227 11.2693 17.0451 12.447 15.5976 12.447Z" fill="white" fill-opacity="0.54"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.38217 10.0454C9.1019 9.88353 8.74358 9.97966 8.58178 10.2599L5.9503 14.8178C5.7885 15.0981 5.88452 15.4564 6.16475 15.6182C6.25702 15.6715 6.35776 15.6968 6.45718 15.6968C6.65968 15.6968 6.85663 15.5917 6.96514 15.4037L9.59663 10.8458C9.75842 10.5656 9.66241 10.2072 9.38217 10.0454Z" fill="white" fill-opacity="0.54"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.30859 11.2109C6.30859 10.8882 6.04539 10.625 5.72266 10.625C5.39992 10.625 5.13672 10.8882 5.13672 11.2109C5.13672 11.5337 5.39996 11.7969 5.72266 11.7969C6.04535 11.7969 6.30859 11.5337 6.30859 11.2109Z" fill="white" fill-opacity="0.54"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.62902 13.9453C9.30629 13.9453 9.04309 14.2085 9.04309 14.5312C9.04309 14.854 9.30633 15.1172 9.62902 15.1172C9.95176 15.1172 10.215 14.8539 10.215 14.5312C10.215 14.2085 9.95172 13.9453 9.62902 13.9453Z" fill="white" fill-opacity="0.54"/>
</g>
<defs>
<clipPath id="clip0_103_566">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>`;
const windSvg = `<path d="M25.316 2.643c-1.516 0-3.002 0.523-4.185 1.472-0.404 0.324-0.468 0.914-0.144 1.318s0.914 0.468 1.318 0.144c0.851-0.683 1.92-1.059 3.011-1.059 2.652 0 4.809 2.157 4.809 4.809s-2.158 4.809-4.809 4.809h-17.628c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938h17.628c3.686 0 6.684-2.999 6.684-6.684s-2.999-6.684-6.684-6.684z"></path>
<path d="M5.891 12.268h10.015c0.518 0 0.938-0.42 0.938-0.938s-0.42-0.938-0.938-0.938h-10.015c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938z"></path>
<path d="M15.643 17.893h-14.706c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938h14.706c2.127 0 3.857 1.73 3.857 3.857s-1.73 3.857-3.857 3.857c-0.875 0-1.732-0.302-2.414-0.849-0.404-0.324-0.994-0.26-1.318 0.144s-0.26 0.994 0.144 1.318c1.014 0.814 2.288 1.262 3.588 1.262 3.16 0 5.732-2.571 5.732-5.732s-2.571-5.732-5.732-5.732z"></path>
<path d="M0.938 12.268h1.265c0.518 0 0.938-0.42 0.938-0.938s-0.42-0.938-0.938-0.938h-1.265c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938z"></path>
<path d="M12.25 22.563c0-0.518-0.42-0.938-0.938-0.938h-5.625c-0.518 0-0.938 0.42-0.938 0.938s0.42 0.938 0.938 0.938h5.625c0.518 0 0.938-0.42 0.938-0.938z"></path>
`;

const clearDay = '';

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
  snowSvg,
  sunSvg,
  cloudsAndSunSvg,
  cloudySvg,
};
