import { RenderPosition, render, remove } from '../framework/render.js';
import BoardView from '../ view/board-view.js';
import FilterView from '../ view/filter-view.js';
import PopupView from '../ view/popup-view.js';
import SortView from '../ view/sort-view.js';
import FilmsListView from '../ view/films-list-view.js';
import FilmsListContainerView from '../ view/films-list-container-view';
import FilmCardView from '../ view/film-card-view.js';
import NoFilmView from '../ view/no-film-view.js';
import ShowMoreButtonView from '../ view/show-more-button-view.js';

const FILM_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #popupContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #boardComponent = new BoardView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #showMoreButtonComponent = null;

  #films = [];
  #comments = [];

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();

  #sortComponent = new SortView();
  #noFilmsComponent = new NoFilmView();

  constructor({boardContainer, popupContainer, filmsModel, commentsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];
    this.#comments = this.#commentsModel.comments;

    this.#renderBoard();

    render(new FilterView(), this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilmCards(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderSort() {
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms() {
    render(this.#noFilmsComponent, this.#boardComponent.element);
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView( {
      onClick: this.#handleShowMoreButtonClick
    });

    render(this.#showMoreButtonComponent, this.#boardComponent.element);
  }

  #renderFilmsList() {
    render(this.#listComponent, this.#boardComponent.element);
    this.#renderFilmsListContainer();

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmsListContainer() {
    render(this.#listContainerComponent, this.#boardComponent.element);
  }

  #renderFilmCards(from, to) {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  }

  #renderFilmCard(film) {
    const filmsListContainerElement = document.querySelector('.films-list__container');

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replacePopuptoCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const filmComponent = new FilmCardView({
      film,
      onPopupClick: () => {
        replaceCardtoPopup.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const popupComponent = new PopupView({
      film: {
        ...film,
        comments: film.comments.map((commentId) => this.#comments[commentId])
      },
      onPopupCloseButtonClick: () => {
        replacePopuptoCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardtoPopup() {
      this.#popupContainer.appendChild(popupComponent.element);
    }

    function replacePopuptoCard() {
      popupComponent.element.remove();
    }

    render(filmComponent, filmsListContainerElement);
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#films.every((film) => film.isArchive)) {
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();
    this.#renderFilmsList();
    render(new FilmsListView(true, 'Top rated'), this.#boardContainer, RenderPosition.BEFOREEND);
    render(new FilmsListView(true, 'Most commented'), this.#boardContainer, RenderPosition.BEFOREEND);
  }
}
