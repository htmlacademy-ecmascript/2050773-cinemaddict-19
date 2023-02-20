import { getRandomMovie } from '../mock/mock.js';

const MOVIES_COUNT = 15;

export default class MoviesModel {
  #movies = [];

  constructor() {
    this.#movies = Array.from({length: MOVIES_COUNT}, getRandomMovie);
  }

  get movies() {
    return this.#movies;
  }
}
