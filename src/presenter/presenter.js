import { RenderPosition, render } from '../render.js';
import BoardView from '../ view/board.js';
import FilterView from '../ view/filter.js';
import PopupView from '../ view/popup.js';
import SortView from '../ view/sort.js';
import FilmsListView from '../ view/films-list.js';
import FilmsListContainerView from '../ view/films-list-container';
import FilmCardView from '../ view/film-card.js';
import NoFilmView from '../ view/no-film.js';
import ShowMoreButtonView from '../ view/show-more-button.js';

const FILM_COUNT_PER_STEP = 5;
const isExtra = true;

export default class BoardPresenter {
  #boardContainer = null;
  #popupContainer = null;
  #filmsModel = null;

  #boardComponent = new BoardView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #showMoreButtonComponent = null;

  #films = [];

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();

  constructor({boardContainer, popupContainer, filmsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];

    render(this.#boardComponent, this.#boardContainer);
    render(new FilterView(), this.#boardContainer, RenderPosition.AFTERBEGIN);


    if (this.#films.every((film) => film.isArchive)) {
      render(new NoFilmView(), this.#boardComponent.element);
    } else {
      render(new SortView(), this.#boardContainer, RenderPosition.AFTERBEGIN);
      render(this.#listComponent, this.#boardComponent.element);
      render(this.#listContainerComponent, this.#boardComponent.element);
      render(new FilmsListView(isExtra, 'Top rated'), this.#boardContainer, RenderPosition.BEFOREEND);
      render(new FilmsListView(isExtra, 'Most commented'), this.#boardContainer, RenderPosition.BEFOREEND);
    }

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
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
