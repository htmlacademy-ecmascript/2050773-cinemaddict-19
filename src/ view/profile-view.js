import AbstractView from '../framework/view/abstract-view.js';

const UserStatus = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff'
};

const getProfileName = (watchedFilms) => {
  if (watchedFilms <= 10) {
    return UserStatus.NOVICE;
  }
  if (watchedFilms <= 20) {
    return UserStatus.FAN;
  }
  return UserStatus.MOVIE_BUFF;
};

const createProfileTemplate = (watchedFilms) =>
  `<section class="header__profile profile">
    <p class="profile__rating">${getProfileName(watchedFilms)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class ProfileView extends AbstractView {
  #watchedFilms = null;

  constructor({watchedFilms}) {
    super();
    this.#watchedFilms = watchedFilms;
  }

  get template() {
    return createProfileTemplate(this.#watchedFilms);
  }
}
