import {render, replace, remove} from '../framework/render.js';
import FilterView from '../ view/filter-view.js';
import {filter} from '../utils.js';
import {FilterType, UpdateType} from '../const.js';
import ProfileView from '../ view/profile-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #profileContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #profileComponent = null;
  #filterComponent = null;

  constructor({filterContainer, profileContainer, filterModel, filmsModel}) {
    this.#filterContainer = filterContainer;
    this.#profileContainer = profileContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: '',
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    const prevProfileComponent = this.#profileComponent;
    const watchedFilms = filters.find((film) => film.type === FilterType.HISTORY).count;

    this.#profileComponent = new ProfileView({watchedFilms});

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
    } else {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    }

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#profileContainer);
    } else {
      replace(this.#profileComponent, prevProfileComponent);
      remove(prevProfileComponent);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
