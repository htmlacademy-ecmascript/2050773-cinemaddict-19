import AbstractView from '../framework/view/abstract-view.js';

const createBoardTemplate = (filmsAmount) =>
  ` <section class="footer__statistics">
      <p> ${ filmsAmount } movies inside</p>
    </section>`;

export default class StatisticsView extends AbstractView {
  #filmsModel = null;
  #filmsAmount = null;

  constructor({filmsModel}) {
    super();
    this.#filmsModel = filmsModel;
    this.#filmsAmount = this.#filmsModel.films.length;
  }

  get template() {
    return createBoardTemplate(this.#filmsAmount);
  }
}
