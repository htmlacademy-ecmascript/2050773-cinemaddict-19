import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = null;

  constructor({commentsApiService}) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  async getComments(id) {
    try {
      this.#comments = await this.#commentsApiService.getComments(id);
    } catch(err) {
      this.#comments = [];
    }
    return this.#comments;
  }

  async addComment(updateType, update) {
    try {
      const newComment = await this.#commentsApiService.addComment(update.film.id, update.commentToAdd);
      const film = {
        ...update.film,
        comments: newComment.movie.comments,
      };
      this._notify(updateType, film);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment(updateType, update) {
    return this.#commentsApiService.deleteComment(updateType, update)
      .then(() => {
        const film = {
          ...update.film,
          comments: update.film.comments.filter((comment) => comment !== update),
        };
        this._notify(updateType, film);
      });
  }
}
