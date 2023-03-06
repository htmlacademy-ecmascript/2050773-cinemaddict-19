import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListContainerTemplate = (isExtra, title) =>
  `<div class="films-list__container ${isExtra ? title : ''}"></div>`;

export default class FilmsListContainerView extends AbstractView {
  #isExtra = null;
  #title = null;

  constructor(isExtra, title) {
    super();
    this.#isExtra = isExtra;
    this.#title = title;
  }

  get template() {
    return createFilmsListContainerTemplate(this.#isExtra, this.#title);
  }
}
