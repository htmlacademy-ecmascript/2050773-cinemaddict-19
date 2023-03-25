import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class CommentsApiService extends ApiService {

  async getComments(id) {
    return this._load({url: `comments/${id}`})
      .then(ApiService.parseResponse);
  }

  async addComment(id, comment) {
    // console.log(addComment) приходят верные аргументы, но дальше код не выполняется

    const response = await this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deleteComment(updateType, update) {
    const response = await this._load({
      url: `comments/${update.commentId}`,
      method: Method.DELETE,
    });
    return response;
  }
}
