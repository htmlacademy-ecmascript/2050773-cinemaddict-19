import BoardPresenter from './presenter/presenter.js';
import ProfileView from './ view/profile.js';
import StatisticsView from './ view/statistics.js';
import { RenderPosition, render } from './render.js';
import FilmsModel from './model/films-model.js';

const mockFilmsData = 666;

const mainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('footer');

render(new ProfileView(), headerElement, RenderPosition.BEFOREEND);
render(new StatisticsView(mockFilmsData), footerElement, RenderPosition.BEFOREEND);

// const filmsListElement = document.querySelector('.films');

const filmsModel = new FilmsModel();

const boardPresenter = new BoardPresenter({
  boardContainer: mainElement,
  popupContainer: bodyElement,
  filmsModel
});


// const popupPresenter = new PopupPresenter({
//   popupContainer: bodyElement
// });

// render(new PopupView(), bodyElement, RenderPosition.BEFOREEND);

boardPresenter.init();
// popupPresenter.init();
