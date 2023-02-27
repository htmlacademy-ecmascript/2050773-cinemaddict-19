import { createElement } from '../render.js';

const createFilmsListContainerTemplate = () =>
  '<div class="films-list__container"></div>';

export default class FilmsListContainerView {
  #element = null;

  get template() {
    return createFilmsListContainerTemplate();
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
