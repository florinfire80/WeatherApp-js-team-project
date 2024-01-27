(() => {
  const URL = 'https://pixabay.com/api/';
  const KEY = '&key=39735160-014c6c17620a2b57de6626257';
  const requestParameters = `?image_type=photo&category=travel&orientation=horizontal&q=bucharest&page=1&per_page=40`;
  const bg = document.querySelector('.backgroundImage');

  fetch(URL + requestParameters + KEY, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(image => {
      // console.log(image);
      const randomImg = Math.floor(Math.random() * image.hits.length);
      const img = image.hits[randomImg].largeImageURL;
      bg.style.backgroundImage = `url(${img})`;
    });
})();

// const axios = require('axios'); // Import Axios

// (() => {
//   const URL = 'https://pixabay.com/api/';
//   const KEY = '&key=39735160-014c6c17620a2b57de6626257';
//   const requestParameters =
//     '?image_type=photo&category=travel&orientation=horizontal&q=bucharest&page=1&per_page=40';
//   const bg = document.querySelector('.backgroundImage');

//   // Use Axios instead of fetch
//   axios
//     .get(`${URL}?${requestParameters}&key=${KEY}`)
//     .then(response => {
//       const image = response.data;
//       console.log(image);

//       const randomImg = Math.floor(Math.random() * image.hits.length);
//       const img = image.hits[randomImg].largeImageURL;
//       bg.style.backgroundImage = `url(${img})`;
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//     });
// })();
