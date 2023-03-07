import { RenderPosition, render, remove } from '../framework/render.js';
import BoardView from '../ view/board-view.js';
import FilterView from '../ view/filter-view.js';
import SortView from '../ view/sort-view.js';
import FilmsListView from '../ view/films-list-view.js';
import FilmsListContainerView from '../ view/films-list-container-view';
import NoFilmView from '../ view/no-film-view.js';
import ShowMoreButtonView from '../ view/show-more-button-view.js';
import FilmPresenter from './film-presenter.js';
import { updateItem, getTopRatedFilms, getMostCommentedFilms } from '../utils.js';
import { sortByRating } from '../utils.js';
import { SortType } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #bodyElement = null;
  #filmsModel = null;
  #commentsModel = null;

  #boardComponent = new BoardView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #showMoreButtonComponent = null;

  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  #films = [];
  #comments = [];

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();
  #listTopRatedContainerComponent = new FilmsListContainerView(true, 'top-rated');
  #listMostCommentedContainerComponent = new FilmsListContainerView(true, 'most-commented');

  #sortComponent = null;
  #noFilmsComponent = new NoFilmView();

  constructor({boardContainer, bodyElement, filmsModel, commentsModel}) {
    this.#boardContainer = boardContainer;
    this.#bodyElement = bodyElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];
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

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#comments);
  };

  #sortFilms(sortType) {
    this.#currentSortType = sortType;

    switch (this.#currentSortType) {
      case this.#currentSortType.RATING:
        this.#films.sort(sortByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms() {
    render(this.#noFilmsComponent, this.#boardComponent.element);
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView( {
      onClick: this.#handleShowMoreButtonClick
    });

    render(this.#showMoreButtonComponent, this.#listComponent.element);
  }

  #clearFilmsList() {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmsList() {
    const minValueFilmCount = Math.min(this.#films.length, FILM_COUNT_PER_STEP);

    render(this.#listComponent, this.#boardComponent.element);
    render(this.#listContainerComponent, this.#listComponent.element);

    for (let i = 0; i < minValueFilmCount; i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmCards(from, to) {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film));
  }

  #renderFilmCard(film) {
    const filmsListContainerElement = document.querySelector('.films-list__container');

    const filmPresenter = new FilmPresenter({
      filmListContainer: filmsListContainerElement,
      bodyElement: this.#bodyElement,
      onDataChange: this.#handleFilmChange,
      onModeChange: this.#handleModeChange
    });

    filmPresenter.init(film, this.#comments);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderTopRatedFilms() {
    const filmsExtraComponent = new FilmsListView(true, 'Top rated');

    render(filmsExtraComponent, this.#boardComponent.element, RenderPosition.BEFOREEND);
    render(this.#listTopRatedContainerComponent, filmsExtraComponent.element);

    const topRatedFilms = getTopRatedFilms(this.#films);
    const filmsListTopRatedContainerElement = document.querySelector('.top-rated');

    for (const topRatedFilm of topRatedFilms) {

      const filmExtraPresenter = new FilmPresenter({
        filmListContainer: filmsListTopRatedContainerElement,
        bodyElement: this.#bodyElement,
        onDataChange: this.#handleFilmChange,
        onModeChange: this.#handleModeChange
      });

      filmExtraPresenter.init(topRatedFilm, this.#comments);
      this.#filmPresenter.set(topRatedFilm.id, filmExtraPresenter);
    }
  }

  #renderMostCommentedFilms() {
    const filmsExtraComponent = new FilmsListView(true, 'Most commented');

    render(filmsExtraComponent, this.#boardComponent.element, RenderPosition.BEFOREEND);
    render(this.#listMostCommentedContainerComponent, filmsExtraComponent.element);

    const mostCommentedFilms = getMostCommentedFilms(this.#films);
    const filmsListMostCommentedContainerElement = document.querySelector('.most-commented');

    for (const mostCommentedFilm of mostCommentedFilms) {

      const filmExtraPresenter = new FilmPresenter({
        filmListContainer: filmsListMostCommentedContainerElement,
        bodyElement: this.#bodyElement,
        onDataChange: this.#handleFilmChange,
        onModeChange: this.#handleModeChange
      });

      filmExtraPresenter.init(mostCommentedFilm, this.#comments);
      this.#filmPresenter.set(mostCommentedFilm.id, filmExtraPresenter);
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#films.every((film) => film.isArchive)) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsList();
    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  }
}
