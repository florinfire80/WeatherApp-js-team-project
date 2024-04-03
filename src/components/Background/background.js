import { URL, KEY } from '../config';

(() => {
  const requestParameters = `?image_type=photo&category=travel&orientation=horizontal&q=bucharest&page=1&per_page=40`;
  const bg = document.querySelector('.backgroundImage');

  fetch(URL + requestParameters + KEY, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(image => {
      console.log(image);
      const randomImg = Math.floor(Math.random() * image.hits.length);
      const img = image.hits[randomImg].largeImageURL;
      bg.style.backgroundImage = `url(${img})`;
    });
})();
