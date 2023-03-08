import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
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

function createEmojisTemplate(currentEmoji) {
  return EMOJIS.map((emoji) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${emoji === currentEmoji ? 'checked' : ''}>
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
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`).join('')}</ul>`;
}

const createPopupTemplate = (film, comments) => {
  const { filmInfo, currentEmoji } = film;
  const genresTemplate = createGenreTemplate(film);
  const commentsTemplate = createCommentsTemplate(comments);
  const emojisTemplate = createEmojisTemplate(currentEmoji);

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
                <td class="film-details__cell">30 March 1945</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Duration</td>
                <td class="film-details__cell">1h 18m</td>
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

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          ${commentsTemplate}

          <form class="film-details__new-comment" action="" method="get">
            <div class="film-details__add-emoji-label">

            <img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">

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
  #comments = null;

  constructor({film, comments, onPopupCloseButtonClick}) {
    super();
    this.#comments = comments;
    this._setState(PopupView.parseFilmToState(film));
    this.#handlePopupClick = onPopupCloseButtonClick;
    this._restoreHandlers();

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
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
    this.element.querySelector('.film-details__new-comment').addEventListener('change', this.#emojiChangeHandler);
  }

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      currentEmoji: evt.target.value,
    });
  };

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handlePopupClick(PopupView.parseStateToFilm(this._state));
  };

  static parseFilmToState(film) {
    return {...film,
      currentEmoji: 'smile'
    };
  }

  static parseStateToFilm(state) {
    const film = {...state};

    delete film.currentEmoji;
    return film;
  }
}
