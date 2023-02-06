const API_KEY = '5e62b2453973c629f1496ace3a4b7719';
// const API_KEY = '60bdd84997c9f2a4c6cd2341c547ed98';
const BASE_URL = 'https://api.themoviedb.org/3/trending/movie/day';

const cardList = document.querySelector('.cards-list');

async function fetchPopularFilms() {
  try {
    const data = await fetch(`${BASE_URL}?api_key=${API_KEY}`);
    const parcedData = await data.json();
    // console.log(films);
    // console.log(films.results[0].genre_ids);
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
  console.log(images);

  const imageBaseURL = `${images.secure_base_url}${
    images.profile_sizes[images.poster_sizes.length - 1]
  }`;
  console.log(imageBaseURL);
  return imageBaseURL;
}

async function getGenres(ids) {
  const data = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );

  const genresData = await data.json();
  const { genres } = genresData;
  console.log(genres);

  let selectedGenres = [];

  genres.filter(item => {
    if (ids.includes(item.id)) {
      console.log(item.name);
      selectedGenres.push(item.name);
      return item.name;
    }
  });
  console.log(selectedGenres);
  return selectedGenres;
}

fetchPopularFilms();
getImages();

async function createMarkup(data, genres) {
  console.log('data results', data);
  //   const imageBaseURL = await getImages();

  // ПРОБА ПЕРА
  const imageBaseURL = 'https://image.tmdb.org/t/p/original';
  console.log(imageBaseURL);

  //   const genreIDs = getGenreIDs(data);
  //   console.log('genre ids', genreIDs);

  const markup = data
    .map(item => {
      console.log('item', item);

      //   const genres = getGenres(genreIDs).then(res => {
      //     return res;
      //   });
      //   console.log('genres', genres);

      return `<li>
    <img src="${imageBaseURL}${item.poster_path}" />
    <p>${genres}</p>
    </li>`;
    })
    .join('');
  return markup;
}

function getGenreIDs(array) {
  const repeatedGenres = array.flatMap(item => {
    return item.genre_ids;
  });
  const genres = new Set(repeatedGenres);
  const genreArray = Array.from(genres);
  return genreArray;
}

async function renderPopularFilms() {
  try {
    const films = await fetchPopularFilms();
    console.log(films);
    const genreIDs = getGenreIDs(films);
    console.log('genre ids', genreIDs);
    const genres = await getGenres(genreIDs);
    console.log('genres', genres);
    const markup = await createMarkup(films, genres);
    console.log(films);
    console.log(films.genre_ids);
    // console.log(markup);

    cardList.innerHTML = markup;
  } catch (error) {
    console.dir(error);
  }
}

renderPopularFilms();
