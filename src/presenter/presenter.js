import { render } from '../render.js';
import FilmsListContainerView from '../ view/films-list-container';
import FilmCardView from '../ view/film-card.js';


const CARDS_COUNT = 5;


export default class BoardPresenter {
  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new FilmsListContainerView(), this.boardContainer);

    const filmsListContainerElement = document.querySelector('.films-list__container');

    for (let i = 0; i < CARDS_COUNT; i++) {
      render(new FilmCardView, filmsListContainerElement);
    }
  }
}
