import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListContainerTemplate = (isExtra, cssClassName) =>
  `<div class="films-list__container ${isExtra ? cssClassName : ''}"></div>`;

export default class FilmsListContainerView extends AbstractView {
  #isExtra = null;
  #cssClassName = null;

  constructor(isExtra, cssClassName) {
    super();
    this.#isExtra = isExtra;
    this.#cssClassName = cssClassName;
  }

  get template() {
    return createFilmsListContainerTemplate(this.#isExtra, this.#cssClassName);
  }
}
