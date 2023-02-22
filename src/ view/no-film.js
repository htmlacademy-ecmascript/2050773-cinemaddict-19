import { createElement } from '../render.js';

const createNoFilmTemplate = () =>
  `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </section> `;

export default class NoFilmView {
  #element = null;

  get template() {
    return createNoFilmTemplate();
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
