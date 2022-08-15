# ArangoFlix GraphQL Endpoint

GraphQL endpoint for the ArangoML Movie Recomendations Demo

Access the full demo site from the Oasis Dashboard Examples by clicking the "Demo" button.

Example GraphQL query to recommend movies using Graph Neural Network inferences.
```
query {
  recommendMoviesPredictionGNN (userId: "User/1", movieRecommendationLimit: 50, expansionLimit:100) {
    movie {
      id
      title
      overview
    }
  }
}
```
Most queries follow a similar pattern, while some may benefit from lower limits. There are additional queries for data exploration such as `allMovies` but these are the main queries used for offering recommendations to a user.

* `recommendMoviesCollaborativeFilteringAQL (userId: "User/1", movieRecommendationLimit: 50, expansionLimit:100)`
* `recommendMoviesContentBasedAQL (userId: "User/1", movieRecommendationLimit: 50, expansionLimit:100)`
* `recommendMoviesContentBasedML (userId: "User/1", movieRecommendationLimit: 50, expansionLimit:100)`
* `recommendMoviesEmbeddingML (userId: "User/1", movieRecommendationLimit: 50, expansionLimit:100)`
* `recommendMoviesPredictionGNN (userId: "User/1", movieRecommendationLimit: 50, expansionLimit:100)`
