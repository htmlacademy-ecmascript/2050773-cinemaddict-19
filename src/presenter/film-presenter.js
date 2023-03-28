import { replace, render, remove } from '../framework/render.js';
import FilmCardView from '../ view/film-card-view.js';
import PopupView from '../ view/popup-view.js';
import {UserAction, UpdateType, FilterType} from '../const.js';

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
  #filterType = null;
  #mode = Mode.DEFAULT;

  constructor({filmListContainer, filterType, bodyElement, onDataChange, onModeChange}) {
    this.#filmListContainer = filmListContainer;
    this.#filterType = filterType;
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
      comments: this.#comments,
      onPopupCloseButtonClick: this.#handlePopupCloseButtonClick,
      onAddToWatchClick: this.#handleAddToWatchClick,
      onAlreadyWatchedClick: this.#handleAlreadyWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteClick: this.#handleDeleteClick,
      onCommentAdd: this.#handleCommentAdd,
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
      replace(this.#filmComponent, prevFilmComponent);

      const scrollPosition = prevPopupComponent.getScrollPosition();

      this.#popupComponent.setScrollPosition(scrollPosition);
      return;
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
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

  setSaving() {
    this.#popupComponent.updateElement({
      isDisabled: true,
    });
  }

  setDeleting() {
    this.#popupComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting(actionType, commentId) {
    if (this.#mode === Mode.DEFAULT) {
      this.#filmComponent.shake();
      return;
    }

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#popupComponent.shakeControls();
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupComponent.shakeComment(commentId);
        break;
      case UserAction.ADD_COMMENT:
        this.#popupComponent.shakeForm();
        break;
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

  async #replaceCardToPopup() {
    if (!this.#comments.length){
      const commentsForFilm = await this.#comments.getComments(this.#film.id);
      this.#popupComponent.setComments(commentsForFilm);
    }

    this.#bodyElement.append(this.#popupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.POPUP;
    this.#popupComponent.resetForm();

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
    let updateType;
    if (this.#filterType === FilterType.ALL || !this.#filterType){
      updateType = UpdateType.PATCH;
    } else {
      updateType = UpdateType.MINOR;
    }

    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      updateType,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watched: !this.#film.userDetails.watched,
        }
      });
  };

  #handleAddToWatchClick = () => {
    let updateType;
    if (this.#filterType === FilterType.ALL || !this.#filterType){
      updateType = UpdateType.PATCH;
    } else {
      updateType = UpdateType.MINOR;
    }

    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      updateType,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist,
        }
      });
  };

  #handleFavoriteClick = () => {
    let updateType;
    if (this.#filterType === FilterType.ALL || !this.#filterType){
      updateType = UpdateType.PATCH;
    } else {
      updateType = UpdateType.MINOR;
    }

    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      updateType,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite,
        }
      });
  };

  #handlePopupCloseButtonClick = () => {
    this.#replacePopupToCard();
    this.#handleDataChange();
  };

  #handleDeleteClick = (commentId) => {
    this.#handleDataChange(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        commentId,
        film: this.#film,
      }
    );
  };

  #handleCommentAdd = (commentToAdd) => {
    const film = this.#film;
    this.#handleDataChange(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        commentToAdd,
        film
      },
    );
  };
}
