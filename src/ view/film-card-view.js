import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const createDescriptionTemplate = (description) => description.length > 140 ? `${description.slice(0, 140)}...` : description;

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo,userDetails} = film;

  const favoriteClassName = userDetails.favorite ? 'film-card__controls-item--active' : '';
  const watchlistClassName = userDetails.watchlist ? 'film-card__controls-item--active' : '';
  const watchedClassName = userDetails.watched ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(filmInfo.release.date).format('YYYY')}</span>
        <span class="film-card__duration">${dayjs.duration(filmInfo.duration, 'minutes').format('H[h] mm[m]')}</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${createDescriptionTemplate(filmInfo.description)}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
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
