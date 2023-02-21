import { createElement } from '../render.js';

const createFilmCardTemplate = (movie) => {
  const {film_info} = movie;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${film_info.title}</h3>
      <p class="film-card__rating">${film_info.total_rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">1933</span>
        <span class="film-card__duration">${film_info.duration}m</span>
        <span class="film-card__genre">${film_info.genre}</span>
      </p>
      <img src="${film_info.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film_info.description}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView {
  #movie = null;
  #element = null;

  constructor(movie) {
    this.#movie = movie;
  }

  get template() {
    return createFilmCardTemplate(this.#movie);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

