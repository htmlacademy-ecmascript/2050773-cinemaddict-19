import dayjs from 'dayjs';
import { FilterType } from './const';

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

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.watched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export { sortByDate, sortByRating, filter };
