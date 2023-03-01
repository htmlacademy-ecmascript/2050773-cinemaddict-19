import AbstractView from '../framework/view/abstract-view.js';

const createBoardTemplate = () => '<section class="films"></section>';

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
