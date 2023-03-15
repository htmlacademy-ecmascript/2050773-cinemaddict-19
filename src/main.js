import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfileView from './ view/profile-view.js';
import StatisticsView from './ view/statistics-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import { RenderPosition, render } from './framework/render.js';

const MOCK_FILMS_AMOUNT = 666;

const mainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('footer');

render(new ProfileView(), headerElement, RenderPosition.BEFOREEND);
render(new StatisticsView(MOCK_FILMS_AMOUNT), footerElement, RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: mainElement,
  bodyElement: bodyElement,
  filmsModel, commentsModel, filterModel
});

const filterPresenter = new FilterPresenter({
  filterContainer: mainElement,
  filterModel,
  filmsModel
});

boardPresenter.init();
filterPresenter.init();
