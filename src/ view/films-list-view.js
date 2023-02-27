import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTemplate = (isExtra, title) =>
  `<section class="films-list ${ isExtra ? 'films-list--extra' : '' }">
    <h2 class="films-list__title ${ isExtra ? '' : 'visually-hidden' }"> ${ title || 'All movies. Upcoming' }</h2>
  </section>`;

export default class FilmsListView extends AbstractView {
  #isExtra = null;
  #title = null;

  constructor(isExtra, title) {
    super();
    this.#isExtra = isExtra;
    this.#title = title;
  }

  get template() {
    return createFilmsListTemplate(this.#isExtra, this.#title);
  }
}
