import BoardView from '../ view/board-view.js';
import SortView from '../ view/sort-view.js';
import FilmsListView from '../ view/films-list-view.js';
import FilmsListContainerView from '../ view/films-list-container-view';
import NoFilmView from '../ view/no-film-view.js';
import ShowMoreButtonView from '../ view/show-more-button-view.js';
import LoadingView from '../ view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import { sortByRating, sortByDate, filter } from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { RenderPosition, render, remove } from '../framework/render.js';

const FILM_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardContainer = null;
  #bodyElement = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #showMoreButtonComponent = null;
  #loadingComponent = new LoadingView();

  #filmPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();

  #sortComponent = null;
  #noFilmsComponent = null;

  constructor({boardContainer, bodyElement, filmsModel, commentsModel, filterModel}) {

    this.#boardContainer = boardContainer;
    this.#bodyElement = bodyElement;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init() {
    this.#renderBoard();
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilmCards(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    try {
      switch (actionType) {
        case UserAction.UPDATE_FILM:
          await this.#filmsModel.updateFilm(updateType, update);
          break;
        case UserAction.ADD_COMMENT:
          this.#filmPresenter.get(update.film.id).setSaving();
          await this.#commentsModel.addComment(updateType, update);
          break;
        case UserAction.DELETE_COMMENT:
          this.#filmPresenter.get(update.film.id).setDeleting();
          await this.#commentsModel.deleteComment(updateType, update);
          break;
      }
    } catch(err) {
      this.#filmPresenter.get(update.film.id).setAborting(actionType, update.commentId);
    }
  };

  #handleModelEvent = async (updateType, data) => {
    let commentsForFilm;
    switch (updateType) {
      case UpdateType.PATCH:
        commentsForFilm = await this.#commentsModel.getComments(data.id);
        this.#filmPresenter.get(data.id).init(data, commentsForFilm);
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms() {
    this.#noFilmsComponent = new NoFilmView({
      filterType: this.#filterType
    });

    render(this.#noFilmsComponent, this.#boardComponent.element);
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView( {
      onClick: this.#handleShowMoreButtonClick
    });

    render(this.#showMoreButtonComponent, this.#listComponent.element);
  }

  #renderFilmCards(films) {
    films.forEach((film) => this.#renderFilmCard(film));
  }

  #renderFilmCard(film) {
    const filmsListContainerElement = document.querySelector('.films-list__container');

    const filmPresenter = new FilmPresenter({
      filmListContainer: filmsListContainerElement,
      filterType: this.#filterType,
      bodyElement: this.#bodyElement,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    filmPresenter.init(film, this.#commentsModel);

    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {

    this.#filmPresenter.forEach((presenter) => presenter.destroy());

    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(this.films.length, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);
    render(this.#listComponent, this.#boardComponent.element);
    render(this.#listContainerComponent, this.#listComponent.element);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    this.#renderFilmCards(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
    if(filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }
}
