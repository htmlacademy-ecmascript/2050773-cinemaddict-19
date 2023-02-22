import { RenderPosition, render } from '../render.js';
import PopupView from '../ view/popup.js';
import FilmsListView from '../ view/films-list.js';
import FilmsListContainerView from '../ view/films-list-container';
import FilmCardView from '../ view/film-card.js';
import ShowMoreButtonView from '../ view/show-more-button.js';

const allCardsCount = 5;
const isExtra = true;

export default class BoardPresenter {
  #boardContainer = null;
  #popupContainer = null;
  #filmsModel = null;


  #films = [];

  #listComponent = new FilmsListView();
  #listContainerComponent = new FilmsListContainerView();

  constructor({boardContainer, popupContainer, filmsModel}) {
    this.#boardContainer = boardContainer;
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#films = [...this.#filmsModel.films];

    render(this.#listComponent, this.#boardContainer);

    const filmsListElement = document.querySelector('.films-list');

    render(this.#listContainerComponent, filmsListElement);

    for (let i = 0; i < allCardsCount; i++) {
      this.#renderFilmCard(this.#films[i]);
    }

    render (new ShowMoreButtonView(), this.#listComponent.element);

    render(new FilmsListView(isExtra, 'Top rated'), this.#boardContainer, RenderPosition.BEFOREEND);

    render(new FilmsListView(isExtra, 'Most commented'), this.#boardContainer, RenderPosition.BEFOREEND);
  }

  #renderFilmCard(film) {
    const filmComponent = new FilmCardView(film);
    const popupComponent = new PopupView(film);
    const filmsListContainerElement = document.querySelector('.films-list__container');


    const replaceCardtoPopup = () => this.#popupContainer.appendChild(popupComponent.element);

    const replacePopuptoCard = () => popupComponent.element.remove();

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replacePopuptoCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      replaceCardtoPopup();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      replacePopuptoCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(filmComponent, filmsListContainerElement);
  }
}
