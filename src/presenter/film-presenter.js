import { render } from '../framework/render.js';
import FilmCardView from '../ view/film-card-view.js';
import PopupView from '../ view/popup-view.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #popupContainer = null;

  #filmComponent = null;
  #popupComponent = null;

  #film = null;
  #comments = null;

  constructor({filmListContainer, popupContainer}) {
    this.#filmListContainer = filmListContainer;
    this.#popupContainer = popupContainer;
  }

  init(film, comments) {
    this.#film = film;
    this.#comments = comments;

    this.#filmComponent = new FilmCardView({
      film: this.#film,
      onPopupClick: this.#handlePopupClick,
    });
    this.#popupComponent = new PopupView({
      film: {
        ...film,
        comments: film.comments.map((commentId) => this.#comments[commentId])
      },
      onPopupCloseButtonClick: this.#handlePopupCloseButtonClick,
    });
    render(this.#filmComponent, this.#filmListContainer);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replacePopuptoCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceCardtoPopup() {
    this.#popupContainer.appendChild(this.#popupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replacePopuptoCard() {
    this.#popupComponent.element.remove();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handlePopupClick = () => {
    this.#replaceCardtoPopup();
  };

  #handlePopupCloseButtonClick = () => {
    this.#replacePopuptoCard();
  };
}
