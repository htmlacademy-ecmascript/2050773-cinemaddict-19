import AbstractView from '../framework/view/abstract-view.js';

const createFilmCardTemplate = (film) => {
  const {filmInfo} = film;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmInfo.release.date}</span>
        <span class="film-card__duration">${filmInfo.duration}m</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;
  #handlePopupClick = null;
  #handleFavoriteClick = null;
  #handleAlreadyWatchedClick = null;
  #handleAddToWatchClick = null;

  constructor({film, onPopupClick, onFavoriteClick, onAlreadyWatchedClick, onAddToWatchClick}) {
    super();
    this.#film = film;
    this.#handlePopupClick = onPopupClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#handleAlreadyWatchedClick = onAlreadyWatchedClick;
    this.#handleAddToWatchClick = onAddToWatchClick;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#popupClickHandler);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addToWatchClickHandler);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  #popupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handlePopupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAlreadyWatchedClick();
  };

  #addToWatchClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAddToWatchClick();
  };
}
