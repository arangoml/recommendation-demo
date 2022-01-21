'use strict';
const db = require('@arangodb').db;

const moviesCollectionName = module.context.collectionName('Movie');
if (!db._collection(moviesCollectionName)) {
  const movies = db._createDocumentCollection(moviesCollectionName);
  [
    {
        "_key": "47",
        "_id": "Movie/47",
        "adult": "False",
        "budget": 33000000,
        "genres": [
          "Mystery",
          "Thriller"
        ],
        "imdbId": "0114369",
        "name": "Seven (a.k.a. Se7en)",
        "originalLanguage": "en",
        "originalTitle": "Se7en",
        "overview": "Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the \"seven deadly sins\" in this dark and haunting film that takes viewers from the tortured remains of one victim to the next. The seasoned Det. Sommerset researches each sin in an effort to get inside the killer's mind, while his novice partner, Mills, scoffs at his efforts to unravel the case.",
        "popularity": 18.45743,
        "releaseDate": "1995-09-22",
        "revenue": 327311859,
        "runTime": 127,
        "status": "Released",
        "tagline": "Seven deadly sins. Seven ways to die.",
        "title": "Seven (a.k.a. Se7en) (1995)",
        "tmdbId": "807",
        "video": "False",
        "voteAverage": 8.1,
        "voteCount": 5915,
        "year": "1995",
        "backdropPath": null,
        "posterPath": null
      },
      {
        "_key": "50",
        "_id": "Movie/50",
        "adult": "False",
        "budget": 6000000,
        "genres": [
          "Crime",
          "Mystery",
          "Thriller"
        ],
        "imdbId": "0114814",
        "name": "Usual Suspects, The",
        "originalLanguage": "en",
        "originalTitle": "The Usual Suspects",
        "overview": "Held in an L.A. interrogation room, Verbal Kint attempts to convince the feds that a mythic crime lord, Keyser Soze, not only exists, but was also responsible for drawing him and his four partners into a multi-million dollar heist that ended with an explosion in San Pedro harbor – leaving few survivors. Verbal lures his interrogators with an incredible story of the crime lord's almost supernatural prowess.",
        "popularity": 16.302466,
        "releaseDate": "1995-07-19",
        "revenue": 23341568,
        "runTime": 106,
        "status": "Released",
        "tagline": "Five Criminals. One Line Up. No Coincidence.",
        "title": "Usual Suspects, The (1995)",
        "tmdbId": "629",
        "video": "False",
        "voteAverage": 8.1,
        "voteCount": 3334,
        "year": "1995",
        "backdropPath": null,
        "posterPath": null
      }
  ].forEach(function (movie) {
    movies.save(movie);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${moviesCollectionName} already exists. Leaving it untouched.`);
}

const usersCollectionName = module.context.collectionName('User');
if (!db._collection(usersCollectionName)) {
  const users = db._createDocumentCollection(usersCollectionName);
  users.ensureSkiplist('$type');
  [
    {
        "_id": "User/1",
        "_key": "1",
        "name": "User-1"
      },
  ].forEach(function (user) {
    users.save(user);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${usersCollectionName} already exists. Leaving it untouched.`);
}

const ratesCollectionName = module.context.collectionName('rates');
if (!db._collection(ratesCollectionName)) {
  const rates = db._createEdgeCollection(ratesCollectionName);
  [
    {
        "_key": "12839790",
        "_id": "rates/12839790",
        "_from": "User/1",
        "_to": "Movie/47",
        "_rev": "_di8Kz6C--B",
        "rating": 5,
        "timestamp": 964983815
      },
      {
        "_key": "12839791",
        "_id": "rates/12839791",
        "_from": "User/1",
        "_to": "Movie/50",
        "_rev": "_di8Kz6C--C",
        "rating": 5,
        "timestamp": 964982931
      }
  ].forEach(function (rating) {
    rates.save(rating);
  });
} else if (module.context.isProduction) {
  console.warn(`collection ${ratesCollectionName} already exists. Leaving it untouched.`);
}