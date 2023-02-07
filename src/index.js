const API_KEY = '5e62b2453973c629f1496ace3a4b7719';
// const API_KEY = '60bdd84997c9f2a4c6cd2341c547ed98';
const BASE_URL = 'https://api.themoviedb.org/3/trending/movie/day';

const cardList = document.querySelector('.trending-gallery');

async function fetchPopularFilms() {
  try {
    const data = await fetch(`${BASE_URL}?api_key=${API_KEY}`);
    const parcedData = await data.json();
    const { results } = parcedData;
    return results;
  } catch (error) {
    console.dir(error);
  }
}

async function getImages() {
  const data = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`
  );
  const parcedData = await data.json();
  const { images } = parcedData;
  console.log('images', images);

  const imageBaseURL = `${images.secure_base_url}${
    images.profile_sizes[images.profile_sizes.length - 1]
  }`;
  console.log(imageBaseURL);
  return imageBaseURL;
}

async function getGenres() {
  const data = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );
  // отримуємо назви жанрів
  const genresData = await data.json();
  const { genres } = genresData;
  console.log(genres);

  // масив об'єктів з властивістю id i значенням name

  const genreNames = {};

  genres.map(item => {
    genreNames[item.id] = item.name;
  });

  console.log('genreNames', genreNames);

  return genreNames;
}

fetchPopularFilms();
getImages();

async function createMarkup(data) {
  console.log('data results', data);
  const imageBaseURL = await getImages();

  const genreNames = await getGenres();
  console.log('genreNames in markup', genreNames);

  // const imageBaseURL = 'https://image.tmdb.org/t/p/original';
  console.log(imageBaseURL);

  const markup = data
    .map(item => {
      let genres = '';
      const genresNamesToRender = getGenreDeciphered(item, genreNames);
      if (genresNamesToRender.includes('Science Fiction')) {
        genres = `${genresNamesToRender[0]}, Other`;
      } else if (genresNamesToRender.length > 2) {
        genres = `${genresNamesToRender[0]}, ${genresNamesToRender[1]}, Other`;
      } else {
        genres = genresNamesToRender;
      }

      console.log('item', item);
      return `<li>
    <img src="${imageBaseURL}${item.poster_path}" 
          alt="The poster of ${item.title} film" 
          class="trending-gallery__image" />
    <div class="trending-gallery__wrapper">
    <h3 class="trending-gallery__title">${item.title}</h3>
    <p class="trending-gallery__info">${genres} | <span>${item.release_date.slice(
        0,
        4
      )}</span></p>
    </div>
    </li>`;
    })
    .join('');
  return markup;
}

function getGenreDeciphered(filmObject, genresList) {
  const genreArray = filmObject.genre_ids;

  const genreNamesToRender = genreArray.map(item => {
    return genresList[item];
  });

  console.log('genresToRender', genreNamesToRender);
  return genreNamesToRender;
}

async function renderPopularFilms() {
  try {
    const films = await fetchPopularFilms();
    console.log(films);
    const markup = await createMarkup(films);
    console.log(films);
    console.log(films.genre_ids);
    // console.log(markup);

    cardList.innerHTML = markup;
  } catch (error) {
    console.dir(error);
  }
}

renderPopularFilms();
