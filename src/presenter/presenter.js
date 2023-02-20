import { render } from '../render.js';
import FilmsListContainerView from '../ view/films-list-container';
import FilmCardView from '../ view/film-card.js';


const CARDS_COUNT = 5;


export default class BoardPresenter {
  #boardContainer = null;
  #moviesModel = null;

  #movies = [];

  #listComponent = new FilmsListContainerView();

  constructor({boardContainer, moviesModel}) {
    this.#boardContainer = boardContainer;
    this.#moviesModel = moviesModel;
  }

  init() {
    this.#movies = [...this.#moviesModel.movies];

    render(this.#listComponent, this.#boardContainer);

    const filmsListContainerElement = document.querySelector('.films-list__container');

    for (let i = 0; i < CARDS_COUNT; i++) {
      render(new FilmCardView, filmsListContainerElement);
    }
  }
}
