import { RenderPosition, render } from '../render.js';
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

  constructor({boardContainer, popupContainer, filmsModel, commentsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];
    const MIN_VALUE_FILM_COUNT = Math.min(this.#films.length, FILM_COUNT_PER_STEP);

    render(this.#boardComponent, this.#boardContainer);
    render(new FilterView(), this.#boardContainer, RenderPosition.AFTERBEGIN);


    if (this.#films.every((film) => film.isArchive)) {
      render(new NoFilmView(), this.#boardComponent.element);
    } else {
      render(new SortView(), this.#boardContainer, RenderPosition.AFTERBEGIN);
      render(this.#listComponent, this.#boardComponent.element);
      render(this.#listContainerComponent, this.#boardComponent.element);
      render(new FilmsListView(true, 'Top rated'), this.#boardContainer, RenderPosition.BEFOREEND);
      render(new FilmsListView(true, 'Most commented'), this.#boardContainer, RenderPosition.BEFOREEND);
    }

    for (let i = 0; i < MIN_VALUE_FILM_COUNT; i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#showMoreButtonComponent = new ShowMoreButtonView();
      render(this.#showMoreButtonComponent, this.#boardComponent.element);
      this.#showMoreButtonComponent.element.addEventListener('click', this.#showMoreButtonClickHandler);
    }
  }

  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();

    }
  };

  #renderFilmCard(film) {
    const filmComponent = new FilmCardView(film);
    const popupComponent = new PopupView(film);
    const filmsListContainerElement = document.querySelector('.films-list__container');

    const replaceCardtoPopup = () => this.#popupContainer.appendChild(popupComponent.element);
    const replacePopuptoCard = () => popupComponent.element.remove();

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replacePopuptoCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      replaceCardtoPopup();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      replacePopuptoCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(filmComponent, filmsListContainerElement);
  }
}
