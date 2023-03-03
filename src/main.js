import BoardPresenter from './presenter/board-presenter.js';
import ProfileView from './ view/profile-view.js';
import StatisticsView from './ view/statistics-view.js';
import { RenderPosition, render } from './framework/render.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

const MOCK_FILMS_AMOUNT = 666;

const mainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('footer');

render(new ProfileView(), headerElement, RenderPosition.BEFOREEND);
render(new StatisticsView(MOCK_FILMS_AMOUNT), footerElement, RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

const boardPresenter = new BoardPresenter({
  boardContainer: mainElement,
  bodyContainer: bodyElement,
  filmsModel, commentsModel
});

boardPresenter.init();
