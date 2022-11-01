GraphQL service for the ArangoML Movie Recomendations Demo

# ArangoDB Instance
This assumes a running ArangoDB instance either with [ArangoGraph Cloud](https://cloud.arangodb.com/) or [download](https://www.arangodb.com/download/) and install locally.

Once ArangoDB has been setup install the foxx service as described below. Then you can access the demo site as described in the "Start the local site" section.

Note: The script tag below is fully shown in the markdown file but is properly loaded when the foxx service is installed.

# foxx

`npm install`

zip entire folder to include `node_modules` folder

OR with [foxx-cli](https://github.com/arangodb/foxx-cli)


`foxx --server yourConfiguredServer install /your-desired-endpoint`


Access the ArangoFlix demo site:

<h2>Start the local site:</h2>

`docker run -it -p 80:80 --name ArangoFlix arangoml/arangoflix:1.0`

<h2>Click the following link:</h2>

<a id="urlTag" href="" target="_blank">open</a>

<h3>If you are prompted for credentials use the following</h3>

**GraphQL Endpoint**: <a id="graphQLURLanchor" href="" target="_blank"><p id="graphQLURL"></p></a>

**Username**: `arangoflix`

**Password**: `arangoflix`

<script>
  document.getElementById("urlTag").innerHTML = ("http://localhost:80/?OasisURL=" +(window.location.href.split("/_db")[0] + window.arangoHelper.databaseUrl("") + "/ml-demo") + "&OasisUSERNAME=arangoflix&OasisPASSWORD=arangoflix")
  document.getElementById("urlTag").href = ("http://localhost:80/?OasisURL=" +(window.location.href.split("/_db")[0] + window.arangoHelper.databaseUrl("") + "/ml-demo") + "&OasisUSERNAME=arangoflix&OasisPASSWORD=arangoflix")
  


  document.getElementById("graphQLURL").innerHTML = (window.location.href.split("/_db")[0] + window.arangoHelper.databaseUrl("") + "/ml-demo")
  document.getElementById("graphQLURLanchor").href = (window.location.href.split("/_db")[0] + window.arangoHelper.databaseUrl("") + "/ml-demo")
</script>

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
