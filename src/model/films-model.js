import { getRandomFilm } from '../mock/films.js';

const FILMS_COUNT = 5;

export default class FilmsModel {
  #films = [];

  constructor() {
    this.#films = Array.from({length: FILMS_COUNT}, getRandomFilm);
  }

  get films() {
    return this.#films;
  }
}
