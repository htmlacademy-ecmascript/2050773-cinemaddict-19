import { getRandomArrayElement } from '../utils.js';

const POSTERS = ['images/posters/blue-blazes.jpg', 'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png', 'images/posters/the-dance-of-life.jpg'];

// const getRandomPoster = getRandomArrayElement(POSTERS);

const mockComments = [
  {
    'id': '1',
    'author': 'Ilya O\'Reilly',
    'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'date': '2022-05-11T16:12:32.554Z',
    'emotion': 'smile'
  },
  {
    'id': '2',
    'author': 'Nastya Chasovskikh',
    'comment': 'the film is piece of shit',
    'date': '2023-01-11T16:12:32.554Z',
    'emotion': 'puke'
  },
  {
    'id': '3',
    'author': 'Ilya Matveev',
    'comment': 'lives up to the hype',
    'date': '2023-05-05T16:12:32.554Z',
    'emotion': 'sleeping'
  },
  {
    'id': '4',
    'author': 'Guess Who',
    'comment': 'I will find and kill you.',
    'date': '2023-11-11T16:12:32.554Z',
    'emotion': 'angry'
  }
];

const mockMovies = [
  {
    'id': '0',
    'comments': [
      1, 2
    ],
    'film_info': {
      'title': 'A Little Pony Without The Carpet',
      'alternative_title': 'Laziness Who Sold Themselves',
      'total_rating': 5.3,
      'poster': POSTERS[3],
      'age_rating': 0,
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano'
      ],
      'actors': [
        'Morgan Freeman'
      ],
      'release': {
        'date': '2019-05-11T00:00:00.000Z',
        'release_country': 'Finland'
      },
      'duration': 77,
      'genre': [
        'Comedy'
      ],
      'description': 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
    },
    'user_details': {
      'watchlist': false,
      'already_watched': true,
      'watching_date': '2019-04-12T16:12:32.554Z',
      'favorite': false
    }
  },
  {
    'id': '1',
    'comments': [
      3, 4
    ],
    'film_info': {
      'title': 'M3GAN',
      'alternative_title': 'M3GAN',
      'total_rating': 3.3,
      'poster': POSTERS[1],
      'age_rating': 18,
      'director': 'Gerard Johnstone',
      'writers': [
        'Ben Milsom'
      ],
      'actors': [
        'Amie Donald'
      ],
      'release': {
        'date': '2023-05-11T00:00:00.000Z',
        'release_country': 'USA'
      },
      'duration': 177,
      'genre': [
        'Horror'
      ],
      'description': 'M3GAN is a marvel of artificial intelligence, a lifelike doll that\'s programmed to be a child\'s greatest companion and a parent\'s greatest ally.'
    },
    'user_details': {
      'watchlist': false,
      'already_watched': true,
      'watching_date': '2023-04-12T16:12:32.554Z',
      'favorite': false
    }
  },
  {
    'id': '2',
    'comments': [
      2, 3
    ],
    'film_info': {
      'title': 'The Menu',
      'alternative_title': 'The Menu',
      'total_rating': 5,
      'poster': POSTERS[2],
      'age_rating': 18,
      'director': ' Mark Mylod',
      'writers': [
        'Lindsey Moran'
      ],
      'actors': [
        'Ralph Fiennes'
      ],
      'release': {
        'date': '2022-01-11T00:00:00.000Z',
        'release_country': 'UK'
      },
      'duration': 107,
      'genre': [
        'Comedy'
      ],
      'description': 'The Menu ist eine US-amerikanische schwarzhumorige Satire mit Horrorelementen von Regisseur Mark Mylod, in der das Thema Haute Cuisine in den Mittelpunkt'
    },
    'user_details': {
      'watchlist': true,
      'already_watched': true,
      'watching_date': '2023-12-12T16:12:32.554Z',
      'favorite': false
    }
  }
];

const getRandomMovie = () => getRandomArrayElement(mockMovies);

export { getRandomMovie, mockComments };
