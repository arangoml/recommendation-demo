GraphQL service for the ArangoML Movie Recomendations Demo

# foxx

`npm install`

zip entire folder to include `node_modules` folder

OR with [foxx-cli](https://github.com/arangodb/foxx-cli)

`foxx --server yourConfiguredServer install /your-desired-endpoint`


example query
```
{
  "data": {
    "actorGraph": [
      {
        "vertices": [
          {
            "personID": "2911f9e2c86647e2fad007009b474dd8",
            "name": "Jonathan Hyde"
          },
          {
            "movieID": "2",
            "title": "Jumanji (1995)"
          }
        ],
        "edges": [
          {
            "id": "2-2911f9e2c86647e2fad007009b474dd8",
            "from": "Movie/2",
            "to": "Person/2911f9e2c86647e2fad007009b474dd8",
            "rev": "_di8KyM----"
          }
        ],
        "path": {
          "vertices": [
            {
              "personID": "2911f9e2c86647e2fad007009b474dd8",
              "name": "Jonathan Hyde"
            },
            {
              "movieID": "2",
              "title": "Jumanji (1995)"
            }
          ]
        }
      }
    ],
    "allMovies": [
      {
        "id": "1",
        "title": "Toy Story (1995)"
      },
      {
        "id": "2",
        "title": "Jumanji (1995)"
      }
    ]
  }
}
```
