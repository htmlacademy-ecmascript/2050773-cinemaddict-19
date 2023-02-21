import { createElement } from '../render.js';

const createFilmsListTemplate = (isExtra, title) =>
  `<section class="films-list ${ isExtra ? 'films-list--extra' : '' }">
    <h2 class="films-list__title ${ isExtra ? '' : 'visually-hidden' }"> ${ title || 'All movies. Upcoming' }</h2>
  </section>`;

export default class FilmsListView {
  #element = null;

  get template() {
    return createFilmsListTemplate();
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
