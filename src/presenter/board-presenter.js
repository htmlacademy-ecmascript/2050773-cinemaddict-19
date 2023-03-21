import BoardView from '../ view/board-view.js';
import SortView from '../ view/sort-view.js';
import FilmsListView from '../ view/films-list-view.js';
import FilmsListContainerView from '../ view/films-list-container-view';
import NoFilmView from '../ view/no-film-view.js';
import ShowMoreButtonView from '../ view/show-more-button-view.js';
import LoadingView from '../ view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import { getTopRatedFilms, getMostCommentedFilms, sortByRating, sortByDate, filter } from '../utils.js';
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
  #filmsTopRatedPresenter = new Map();
  #filmsMostCommentedPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.WATCHLIST;
  #isLoading = true;

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();
  #listTopRatedContainerComponent = new FilmsListContainerView(true, 'top-rated');
  #listMostCommentedContainerComponent = new FilmsListContainerView(true, 'most-commented');

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

  // get comments() {
  //   return this.#commentsModel.comments;
  // }

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
    this.#filmsTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this.#filmsMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update); для проверки входящих данных

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(data, this.comments);
        }
        if (this.#filmsTopRatedPresenter.get(data.id)){
          this.#filmsTopRatedPresenter.get(data.id).init(data, this.comments);
        }
        if (this.#filmsMostCommentedPresenter.get(data.id)){
          this.#filmsMostCommentedPresenter.get(data.id).init(data, this.comments);
        }
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
      bodyElement: this.#bodyElement,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    filmPresenter.init(film, this.#commentsModel);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderTopRatedFilms(films, comments) {
    const filmsExtraComponent = new FilmsListView(true, 'Top rated');

    render(filmsExtraComponent, this.#boardComponent.element);
    render(this.#listTopRatedContainerComponent, filmsExtraComponent.element);

    const topRatedFilms = getTopRatedFilms(films);
    const filmsListTopRatedContainerElement = document.querySelector('.top-rated');

    for (const topRatedFilm of topRatedFilms) {

      const filmExtraPresenter = new FilmPresenter({
        filmListContainer: filmsListTopRatedContainerElement,
        bodyElement: this.#bodyElement,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange
      });

      filmExtraPresenter.init(topRatedFilm, comments);
      this.#filmsTopRatedPresenter.set(topRatedFilm.id, filmExtraPresenter);
    }
  }

  #renderMostCommentedFilms(films, comments) {
    const filmsExtraComponent = new FilmsListView(true, 'Most commented');

    render(filmsExtraComponent, this.#boardComponent.element);
    render(this.#listMostCommentedContainerComponent, filmsExtraComponent.element);

    const mostCommentedFilms = getMostCommentedFilms(films);
    const filmsListMostCommentedContainerElement = document.querySelector('.most-commented');

    for (const mostCommentedFilm of mostCommentedFilms) {

      const filmExtraPresenter = new FilmPresenter({
        filmListContainer: filmsListMostCommentedContainerElement,
        bodyElement: this.#bodyElement,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange
      });

      filmExtraPresenter.init(mostCommentedFilm, comments);
      this.#filmsMostCommentedPresenter.set(mostCommentedFilm.id, filmExtraPresenter);
    }
  }

  #clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this.films.length;

    // console.log(this.#filmPresenter);  Проблема: не все фильмы попадают в #filmPresenter, потому что у некоторых фильмов одинаковые айди, из-за чего не все из них удаляются методом destroy()

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsMostCommentedPresenter.forEach((presenter) => presenter.destroy());

    this.#filmPresenter.clear();
    this.#filmsTopRatedPresenter.clear();
    this.#filmsMostCommentedPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

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
    render(this.#listComponent, this.#boardComponent.element);
    render(this.#listContainerComponent, this.#listComponent.element);

    this.#renderFilmCards(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
    if(filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }

    // this.#renderTopRatedFilms(this.films, this.comments);
    // this.#renderMostCommentedFilms(this.films, this.comments);
  }
}
