import { replace, render, remove } from '../framework/render.js';
import FilmCardView from '../ view/film-card-view.js';
import PopupView from '../ view/popup-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'POPUP',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #bodyElement = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #filmComponent = null;
  #popupComponent = null;

  #film = null;
  #comments = null;
  #mode = Mode.DEFAULT;

  constructor({filmListContainer, bodyElement, onDataChange, onModeChange}) {
    this.#filmListContainer = filmListContainer;
    this.#bodyElement = bodyElement;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(film, comments) {
    this.#film = film;
    this.#comments = comments;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView({
      film: this.#film,
      onPopupClick: this.#handlePopupClick,
      onAddToWatchClick: this.#handleAddToWatchClick,
      onAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#popupComponent = new PopupView({
      film,
      comments: film.comments.map((commentId) => this.#comments[commentId]),
      onPopupCloseButtonClick: this.#handlePopupCloseButtonClick,
    });

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    // remove(prevFilmComponent);
    // remove(prevPopupComponent);
  }

  destroy() {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#popupComponent.reset(this.#film);
      this.#replacePopupToCard();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#popupComponent.reset(this.#film);
      this.#replacePopupToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceCardToPopup() {
    this.#bodyElement.appendChild(this.#popupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.POPUP;
  }

  #replacePopupToCard() {
    this.#popupComponent.element.remove();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handlePopupClick = () => {
    this.#replaceCardToPopup();
  };

  #handleAlreadyWatchedClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isAlreadyWatched: !this.#film.userDetails.alreadyWatched}
    );
  };

  #handleAddToWatchClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isAddedToWatch: !this.#film.userDetails.watchlist}
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.userDetails.favorite}
    );
  };

  #handlePopupCloseButtonClick = (film) => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      film
    );
    this.#replacePopupToCard();
  };
}
