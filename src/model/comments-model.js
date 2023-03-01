import { mockComments } from '../mock/comments.js';

export default class CommentsModel {
  #comments = [];

  constructor() {
    this.#comments = mockComments;
  }

  get comments() {
    return this.#comments;
  }
}
