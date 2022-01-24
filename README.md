GraphQL service for the ArangoML Movie Recomendations Demo

# foxx

`npm install`

zip entire folder to include `node_modules` folder

OR with [foxx-cli](https://github.com/arangodb/foxx-cli)

`foxx --server yourConfiguredServer install /your-desired-endpoint`


example query
```
query {
  actorGraph(id: "Person/2911f9e2c86647e2fad007009b474dd8") {
    vertices{
      ... on Movie {
      movieID: id
      title
    }
    ... on Person {
      personID: id
      name
    }
      
    }
    edges {
      id
      from
      to
      rev
    }
    path {
    vertices{
      ... on Movie {
      movieID: id
      title
    }
    ... on Person {
      personID: id
      name
    }      
    }
  }
}
  allMovies (limit: 2) {
    id 
    title
  }
}
```
