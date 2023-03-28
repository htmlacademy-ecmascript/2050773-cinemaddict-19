import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatisticsView from './ view/statistics-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import { RenderPosition, render } from './framework/render.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';

const AUTHORIZATION = 'Basic 666hfS44wcl1666j';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';

const mainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('footer');

const filmsModel = new FilmsModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)
});

const commentsModel = new CommentsModel({
  commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  boardContainer: mainElement,
  bodyElement: bodyElement,
  filmsModel, commentsModel, filterModel
});

const filterPresenter = new FilterPresenter({
  filterContainer: mainElement,
  profileContainer: headerElement,
  filterModel,
  filmsModel
});

boardPresenter.init();
filterPresenter.init();
filmsModel.init()
  .finally(() => {
    render(new StatisticsView({filmsModel}), footerElement, RenderPosition.BEFOREEND);
  });
