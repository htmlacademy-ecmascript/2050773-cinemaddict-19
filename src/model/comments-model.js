import Observable from '../framework/observable.js';
import { mockComments } from '../mock/comments.js';

export default class CommentsModel extends Observable {
  #comments = mockComments;

  get comments() {
    return this.#comments;
  }

  updateComment(updateType, update) {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      update,
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update) {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
