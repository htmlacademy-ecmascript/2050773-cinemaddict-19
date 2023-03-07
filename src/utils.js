import dayjs from 'dayjs';

const FILMS_EXTRA_COUNT = 2;

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

const getTopRatedFilms = (films) => Array.from(films.values()).sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, FILMS_EXTRA_COUNT);

const getMostCommentedFilms = (films) => Array.from(films.values()).sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_EXTRA_COUNT);

function getWeightForNullData(dataA, dataB) {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
}

function sortByDate(filmA, filmB) {
  const weight = getWeightForNullData(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
}

function sortByRating(filmA, filmB) {
  const weight = getWeightForNullData(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);
  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
}

export {getRandomArrayElement, updateItem, getTopRatedFilms, getMostCommentedFilms, sortByDate, sortByRating};
