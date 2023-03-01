import AbstractView from '../framework/view/abstract-view.js';

const createBoardTemplate = (filmsAmount) =>
  ` <section class="footer__statistics">
      <p> ${ filmsAmount } movies inside</p>
    </section>`;

export default class StatisticsView extends AbstractView {
  #filmsAmount = null;

  constructor(filmsAmount) {
    super();
    this.#filmsAmount = filmsAmount;
  }

  get template() {
    return createBoardTemplate(this.#filmsAmount);
  }
}
