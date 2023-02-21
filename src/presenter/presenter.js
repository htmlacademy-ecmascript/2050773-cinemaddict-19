import { RenderPosition, render } from '../render.js';
import FilmsListView from '../ view/films-list.js';
import FilmsListContainerView from '../ view/films-list-container';
import FilmCardView from '../ view/film-card.js';
import ShowMoreButtonView from '../ view/show-more-button.js';

const allCardsCount = 5;
// const extraCardsCount = 2;
const isExtra = true;

export default class BoardPresenter {
  #boardContainer = null;
  #moviesModel = null;


  #movies = [];

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();

  constructor({boardContainer, moviesModel}) {
    this.#boardContainer = boardContainer;
    this.#moviesModel = moviesModel;
  }

  init() {
    this.#movies = [...this.#moviesModel.movies];

    render(this.#listComponent, this.#boardContainer);

    const filmsListElement = document.querySelector('.films-list');

    render(this.#listContainerComponent, filmsListElement);

    const filmsListContainerElement = document.querySelector('.films-list__container');

    for (let i = 0; i < allCardsCount; i++) {
      render(new FilmCardView(this.#movies[i]), filmsListContainerElement);
    }

    render (new ShowMoreButtonView(), this.#listComponent.element);

    render(new FilmsListView(isExtra, 'Top rated'), this.#boardContainer, RenderPosition.BEFOREEND);

    // const filmsListExtraElement = document.querySelector('.films-list--extra');
    // render(new FilmsListContainerView(), filmsListExtraElement);

    // const newFilmsListContainerElement = document.querySelector('.films-list__container');


    // for (let i = 0; i < extraCardsCount; i++) {
    //   render(new FilmCardView(this.#movies[i]), newFilmsListContainerElement);
    // }

    render(new FilmsListView(isExtra, 'Most commented'), this.#boardContainer, RenderPosition.BEFOREEND);

  }
}
