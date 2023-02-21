import { createElement } from '../render.js';

const createBoardTemplate = (data) =>
  ` <section class="footer__statistics">
      <p> ${ data } movies inside</p>
    </section>`;

export default class StatisticsView {
  #element = null;
  #data = null;

  constructor(data) {
    this.#data = data;
  }

  get template() {
    return createBoardTemplate(this.#data);
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
