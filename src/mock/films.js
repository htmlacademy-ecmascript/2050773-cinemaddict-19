import { getRandomArrayElement } from '../utils.js';
import { mockComments } from './comments.js';

const POSTERS = ['images/posters/blue-blazes.jpg', 'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png', 'images/posters/the-dance-of-life.jpg'];

const mockFilms = [
  {
    'id': '0',
    isArchive: false,
    isAlreadyWatched: false,
    isAddedToWatch: false,
    'comments': [
      mockComments['14567'].id, mockComments['178967'].id
    ],
    'filmInfo': {
      'title': 'A Little Pony Without The Carpet',
      'alternativeTitle': 'Laziness Who Sold Themselves',
      'totalRating': 5.3,
      'poster': POSTERS[3],
      'ageRating': 0,
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano'
      ],
      'actors': [
        'Morgan Freeman'
      ],
      'release': {
        'date': '2019-05-11T00:00:00.000Z',
        'releaseCountry': 'Finland'
      },
      'duration': 77,
      'genre': [
        'Comedy', 'Test'
      ],
      'description': 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
    },
    'userDetails': {
      'watchlist': false,
      'alreadyWatched': true,
      'watchingDate': '2019-04-12T16:12:32.554Z',
      'favorite': false
    }
  },
  {
    'id': '1',
    isArchive: false,
    isAlreadyWatched: false,
    isAddedToWatch: false,
    'comments': [
      mockComments['2567'].id, mockComments['5673'].id
    ],
    'filmInfo': {
      'title': 'M3GAN',
      'alternativeTitle': 'M3GAN',
      'totalRating': 3.3,
      'poster': POSTERS[1],
      'ageRating': 18,
      'director': 'Gerard Johnstone',
      'writers': [
        'Ben Milsom'
      ],
      'actors': [
        'Amie Donald'
      ],
      'release': {
        'date': '2023-05-11T00:00:00.000Z',
        'releaseCountry': 'USA'
      },
      'duration': 177,
      'genre': [
        'Horror','Comedy', 'Test'
      ],
      'description': 'M3GAN is a marvel of artificial intelligence, a lifelike doll that\'s programmed to be a child\'s greatest companion and a parent\'s greatest ally.'
    },
    'userDetails': {
      'watchlist': false,
      'alreadyWatched': true,
      'watchingDate': '2023-04-12T16:12:32.554Z',
      'favorite': false
    }
  },
  {
    'id': '2',
    isArchive: false,
    isAlreadyWatched: false,
    isAddedToWatch: false,
    'comments': [
      mockComments['9876'].id, mockComments['543123'].id
    ],
    'filmInfo': {
      'title': 'The Menu',
      'alternativeTitle': 'The Menu',
      'totalRating': 5,
      'poster': POSTERS[2],
      'ageRating': 18,
      'director': ' Mark Mylod',
      'writers': [
        'Lindsey Moran'
      ],
      'actors': [
        'Ralph Fiennes'
      ],
      'release': {
        'date': '2022-01-11T00:00:00.000Z',
        'releaseCountry': 'UK'
      },
      'duration': 107,
      'genre': [
        'Comedy', 'Horror','Comedy', 'Test'
      ],
      'description': 'The Menu ist eine US-amerikanische schwarzhumorige Satire mit Horrorelementen von Regisseur Mark Mylod, in der das Thema Haute Cuisine in den Mittelpunkt'
    },
    'userDetails': {
      'watchlist': true,
      'alreadyWatched': true,
      'watchingDate': '2023-12-12T16:12:32.554Z',
      'favorite': false
    }
  }
];

const getRandomFilm = () => getRandomArrayElement(mockFilms);

export { getRandomFilm };
