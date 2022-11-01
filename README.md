GraphQL service for the ArangoML Movie Recomendations Demo

The following describes setting up the local environment for the ArangoFlix demo. However, this can be avoided by simply installing the demo via the Examples tab of any ArangoGraph Cloud deployment > [cloud.arangodb.com](cloud.arangodb.com/)

# ArangoDB Instance
This assumes a running ArangoDB instance either with [ArangoGraph Cloud](https://cloud.arangodb.com/) or [download](https://www.arangodb.com/download/) and install locally.

Once ArangoDB has been setup you need to restore the data. 

# Restoring the data
Start by pulling the data from GitHub
`git clone -b movie-data --single-branch https://github.com/arangodb/interactive_tutorials.git`

Restore into your database, including system collections. This will depend on your specific setup but for example:
```
arangorestore --server.endpoint http:\\localhost:8529 --server.username root --server.password openSesame --create-database true --server.database IMDB --include-system-collections true --inpute-directory movie-knowledge-graph-dump-small
```

Once the data has been restored you can continue to the `foxx` section below and then the `Start the local site` section.

Note: The script tag below is fully shown in the markdown file but is properly loaded when the foxx service is installed.

# foxx
Clone this repository and cd into `recommendation-demo`

`npm install`

zip entire folder including `node_modules` folder

Navigate to the services tab of the recently resotred database and install the microservice.

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
