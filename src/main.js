import BoardPresenter from './presenter/presenter.js';
import FilterView from './ view/filter.js';
import SortView from './ view/sort.js';
import ProfileView from './ view/profile.js';
import FilmsListView from './ view/films-list.js';
import {RenderPosition, render} from './render.js';
import MoviesModel from './model/movies-model.js';


const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

render(new ProfileView(), headerElement, RenderPosition.BEFOREEND);
render(new FilterView(), mainElement);
render(new SortView(), mainElement);
render(new FilmsListView(), mainElement);

const filmsListElement = document.querySelector('.films-list');

const moviesModel = new MoviesModel();

const boardPresenter = new BoardPresenter({
  boardContainer: filmsListElement,
  moviesModel
});

boardPresenter.init();
