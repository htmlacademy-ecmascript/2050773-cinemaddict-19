import PopupView from '../ view/popup.js';
import { render } from '../render.js';

export default class PopupPresenter {
  #popupContainer = null;

  constructor({popupContainer}) {
    this.#popupContainer = popupContainer;
  }

  init() {
    render(new PopupView, this.#popupContainer);

  }
}
