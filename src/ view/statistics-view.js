import { createElement } from '../render.js';

const createBoardTemplate = (filmsAmount) =>
  ` <section class="footer__statistics">
      <p> ${ filmsAmount } movies inside</p>
    </section>`;

export default class StatisticsView {
  #element = null;
  #filmsAmount = null;

  constructor(filmsAmount) {
    this.#filmsAmount = filmsAmount;
  }

  get template() {
    return createBoardTemplate(this.#filmsAmount);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
