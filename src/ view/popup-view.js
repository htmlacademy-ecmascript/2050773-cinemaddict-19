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
  return `<div class="event__available-offers">${filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}`;
};

const createFilmDetailsTemplate = (userDetails) => {

  const favoriteClassName = userDetails.favorite ? 'film-details__control-button--active' : '';
  const watchlistClassName = userDetails.watchlist ? 'film-details__control-button--active' : '';
  const watchedClassName = userDetails.watched ? 'film-details__control-button--active' : '';

  return `<section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
</section>`;
};

function createEmojisTemplate(emotion, isDisabled) {
  return EMOJIS.map((emoji) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${emoji === emotion ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
  </label>`).join('');
}

function createCommentsTemplate(commentsModel, isDisabled, isDeleting) {
  return commentsModel.length ? `<ul class="film-details__comments-list">${commentsModel.map((comment) =>
    ` <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${dayjs(comment.date).fromNow()}</span>
            <button class="film-details__comment-delete" id="${comment.id}" ${isDisabled ? 'disabled' : ''}> ${isDeleting ? 'Deleting...' : 'Delete'}</button>
          </p>
        </div>
      </li>`).join('')}</ul>` : '';
}

const createPopupTemplate = (film, commentsModel) => {
  const { filmInfo, emotion, userDetails, isDisabled, isDeleting, comments } = film;
  const genresTemplate = createGenreTemplate(film);
  const emojisTemplate = createEmojisTemplate(emotion, isDisabled);
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

          ${createCommentsTemplate(commentsModel, isDisabled, isDeleting)}

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
    this.element.addEventListener('scroll', this.#scrollPositionHandler);
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

  setComments(commentsForFilm) {
    this.#comments = commentsForFilm;
  }

  getScrollPosition() {
    return this._state.scrollPosition;
  }

  setScrollPosition(scrollPosition) {
    this.element.scrollTo(0, scrollPosition);
  }

  #scrollPositionHandler = () => {
    this._setState({scrollPosition: this.element.scrollTop});
  };

  shakeControls = () => this.shake.call({element: this.element.querySelector('.film-details__controls')});

  shakeComment = (id) => {
    const button = this.element.querySelector(`.film-details__comment-delete[id='${id}']`);
    const comment = button.closest('.film-details__comment');

    this.shake.call({element: comment}, () => {
      this.updateElement({
        isDisabled: false,
        isDeleting: false,
      });
    });
  };

  shakeForm = () => {
    this.shake.call({element: document.querySelector('form')}, () => {
      this._setState({
        isDisabled: false
      });
    });
  };

  resetForm() {
    this.updateElement({
      comment: '',
      emotion: 'smile',
    });
  }

  #watchlistClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();

    if (!evt.target.classList.contains('film-details__control-button')) {
      return;
    }

    this.#handleAddToWatchClick();
    this.element.scroll(0, currentScrollPosition);
  };

  #watchedClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();

    if (!evt.target.classList.contains('film-details__control-button')) {
      return;
    }

    this.#handleAlreadyWatchedClick();
    this.element.scroll(0, currentScrollPosition);
  };

  #favoriteClickHandler = (evt) => {
    const currentScrollPosition = this.element.scrollTop;
    evt.preventDefault();

    if (!evt.target.classList.contains('film-details__control-button')) {
      return;
    }

    this.#handleFavoriteClick();
    this.element.scroll(0, currentScrollPosition);
  };

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      emotion: evt.target.value,
      scrollPosition: this.element.scrollTop,
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  #commentInputHandler = (evt) => {
    this._setState({
      comment: he.encode(evt.target.value)
    });
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollPosition: this.element.scrollTop
    });
    this.#handleDeleteClick(evt.target.id);
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  #addCommentKeydownHandler = (evt) => {
    if (evt.metaKey && evt.code === 'Enter') {
      const commentToAdd = {
        comment: this._state.comment,
        emotion: this._state.emotion
      };
      this.updateElement({
        scrollPosition: this.element.scrollTop
      });
      this.#handleAddCommentSubmit(commentToAdd);
      this.element.scrollTo(0, this._state.scrollPosition);
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
      isDisabled: false,
      isDeleting: false,
    };
  }

  static parseStateToFilm(state) {
    const film = {...state};

    delete film.emotion;
    delete film.comment;
    delete film.isDeleting;
    delete film.isDisabled;
    return film;
  }
}
