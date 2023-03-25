import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { EMOJIS } from '../const.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const createGenreTemplate = (film) => {
  const { filmInfo } = film;
  return `<div class="event__available-offers">${filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(',')}`;
};

const createFilmDetailsTemplate = (userDetails) => {

  const favoriteClassName = userDetails.favorite ? 'film-details__control-button--active' : '';
  const watchlistClassName = userDetails.watchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = userDetails.watched ? 'film-details__control-button--active' : '';

  return `<section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched" ${watchedClassName} id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
</section>`;
};

function createEmojisTemplate(emotion) {
  return EMOJIS.map((emoji) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${emoji === emotion ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
  </label>`).join('');
}

function createCommentsTemplate(comments) {

  return `<ul class="film-details__comments-list">${comments.map((comment) =>
    ` <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
            <button class="film-details__comment-delete" id="${comment.id}">Delete</button>
          </p>
        </div>
      </li>`).join('')}</ul>`;
}

const createPopupTemplate = (film, comments) => {
  const { filmInfo, emotion, userDetails } = film;
  const genresTemplate = createGenreTemplate(film);
  const commentsTemplate = createCommentsTemplate(comments);
  const emojisTemplate = createEmojisTemplate(emotion);
  const filmDetailsTemplate = createFilmDetailsTemplate(userDetails);

  return `<section class="film-details">
    <div class="film-details__inner">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${filmInfo.poster} alt="">

            <p class="film-details__age">${filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(filmInfo.release.date).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Duration</td>
                <td class="film-details__cell">${dayjs.duration(filmInfo.duration, 'minutes').format('H[h] mm[m]')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell"> ${genresTemplate} </td>
              </tr>
            </table>

            <p class="film-details__film-description">

             ${filmInfo.description}

            </p>
          </div>
        </div>

        ${filmDetailsTemplate}

      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          ${commentsTemplate}

          <form class="film-details__new-comment" action="" method="get">
            <div class="film-details__add-emoji-label">

            <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">

            </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">

              ${emojisTemplate}

              </div>
          </form>
        </section>
      </div>
    </div>
  </section>`;
};

export default class PopupView extends AbstractStatefulView {
  #handlePopupClick = null;
  #handleAddToWatchClick = null;
  #handleAlreadyWatchedClick = null;
  #handleFavoriteClick = null;
  #handleDeleteClick = null;
  #handleAddCommentSubmit = null;

  #comments = null;

  constructor({film, comments, onPopupCloseButtonClick, onAddToWatchClick, onAlreadyWatchedClick, onFavoriteClick, onDeleteClick, onCommentAdd}) {
    super();
    this.#comments = comments;

    this._setState(PopupView.parseFilmToState(film));

    this.#handlePopupClick = onPopupCloseButtonClick;
    this.#handleAddToWatchClick = onAddToWatchClick;
    this.#handleAlreadyWatchedClick = onAlreadyWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleAddCommentSubmit = onCommentAdd;

    this._restoreHandlers();

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#commentDeleteClickHandler));
  }

  get template() {
    return createPopupTemplate(this._state, this.#comments);
  }

  reset(film) {
    this.updateElement(
      PopupView.parseFilmToState(film),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#addCommentKeydownHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteButton) => deleteButton.addEventListener('click', this.#commentDeleteClickHandler));
  }

  #watchlistClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();
    this.#handleAddToWatchClick();
    this.element.scroll(0, currentScrollPosition);
  };

  #watchedClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();
    this.#handleAlreadyWatchedClick();
    this.element.scroll(0, currentScrollPosition);
  };

  #favoriteClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();
    this.#handleFavoriteClick();
    this.element.scroll(0, currentScrollPosition);
  };

  #emojiChangeHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();
    this.updateElement({
      emotion: evt.target.value,
    });
    this.element.scroll(0, currentScrollPosition);
  };

  #commentInputHandler = (evt) => {
    this._setState({
      comment: he.encode(evt.target.value)
    });
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(evt.target.id);
  };

  #addCommentKeydownHandler = (evt) => {
    if (evt.code === 'Enter') {
      const commentToAdd = {
        comment: this._state.comment,
        emotion: this._state.emotion
      };
      this.#handleAddCommentSubmit(commentToAdd);
    }
  };

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handlePopupClick(PopupView.parseStateToFilm(this._state));
  };

  static parseFilmToState(film) {
    return {...film,
      emotion: 'smile',
      comment: null,
    };
  }

  static parseStateToFilm(state) {
    const film = {...state};

    delete film.emotion;
    delete film.comment;
    return film;
  }
}
