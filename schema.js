// const gql = require('graphql-sync'); // 0.12 or later
const graphql = require("graphql");
const {GraphQLInt, GraphQLFloat, GraphQLEnumType} = require("graphql");
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLString = graphql.GraphQLString;
const GraphQLObjectType = graphql.GraphQLObjectType;

const db = require('@arangodb').db;
const aql = require("@arangodb").aql;

//Movie Conceptual Model
const classType = new GraphQLObjectType({
    name: "Class",
    description: "Class type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of a Class",
                resolve(c) {
                    return c._key;
                }
            },
            name: {
                type: GraphQLString,
                description: "The Class name"
            },
            description: {
                type: GraphQLString,
                description: "The Class description"
            },
            collection :{
                type : GraphQLString,
                description: "The collection corresponding the class"
            }

        }
    }
})

const modelType = new GraphQLObjectType({
    name: "Model",
    description: "Model type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of a Model",
                resolve(model) {
                    return model._key;
                }
            },
            name: {
                type: GraphQLString,
                description: "The Model name"
            },
            description: {
                type: GraphQLString,
                description: "The Model description"
            },
            function: {
                type: GraphQLString,
                description: "The Model function"
            },
            components: {
                type: graphql.GraphQLList(GraphQLString),
                description: "List of analytic and ML components in model",
                resolve(m) {
                    return m.components
                }
            }
        }
    }
})

const movieType = new GraphQLObjectType({
    name: "Movie",
    description: "Movie Type",
    fields() {
        return {
            id: {
                type: GraphQLString,
                description: "The id of the movie",
                resolve(movie) {
                        return movie._key
                }
            },
            title: {
                type: GraphQLString,
                description: "The movie title"
            },
            overview: {
                type: GraphQLString,
                description: "The movie overview"
            },
            name: {
                type: GraphQLString,
                description: "The movie name"
            },
            budget: {
                type: GraphQLInt,
                description: "The movie budget"
            },
            imdbId: {
                type: GraphQLString,
                description: "The movie IMDB identifier"
            },
            tmdbId: {
                type: GraphQLString,
                description: "The movie TMDB identifier"
            },
            originalLanguage: {
                type: GraphQLString,
                description: "The movie original language"
            },
            originalTitle: {
                type: GraphQLString,
                description: "The movie original title"
            },
            popularity: {
                type: GraphQLFloat,
                description: "The movie popularity score"
            },
            releaseDate: {
                type: GraphQLString,
                description: "The movie releaseDate"
            },
            revenue: {
                type: GraphQLInt,
                description: "The movie revenue"
            },
            runtime: {
                type: GraphQLInt,
                description: "The movie runtime in minutes"
            },
            tagline: {
                type: GraphQLString,
                description: "The movie tagline"
            },
            posterPath: {
                type: GraphQLString,
                description: "The movie poster path"
            },
            backdropPath: {
                type: GraphQLString,
                description: "The movie backdrop path"
            },
            genres: {
                type: graphql.GraphQLList(GraphQLString),
                description: "List of genres",
                resolve(movie) {
                    return movie.genres
                }
            }
        }
    }
})

const genreType = new GraphQLObjectType({
    name: "Genre",
    description: "Movie genres type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of a movie genre",
                resolve(genre) {
                    return genre._key;
                }
            },
            name: {
                type: GraphQLString,
                description: "The genre name"
            },
            description: {
                type: GraphQLString,
                description: "The genre description"
            }
        }
    }
})

const personType = new GraphQLObjectType({
    name: "Person",
    description: "Person Type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of a person associated with movies",
                resolve(person) {
                    return person._key;
                }
            },
            name: {
                type: GraphQLString,
                description: "The person name"
            }
        }
    }
})

const companyType = new GraphQLObjectType({
    name: "Company",
    description: "Company Type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of a company associated with movies",
                resolve(company) {
                    return company._key;
                }
            },
            name: {
                type: GraphQLString,
                description: "The company name"
            }
        }
    }
})

const userType = new GraphQLObjectType({
    name: "User",
    description: "User Type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of a movie user",
                resolve(user) {
                    return user._key;
                }
            },
            name: {
                type: GraphQLString,
                description: "The user name"
            }
        }
    }
})

const edges = new GraphQLObjectType({
    name: "edges",
    description: "List of edges in a path or Graph",
    fields() {
        return {
            id: {
                type: graphql.GraphQLNonNull(GraphQLString),
                description: "_id value",
                resolve(source) {
                    return source._key;
                }
            },
            name: {
                type: graphql.GraphQLNonNull(GraphQLString),
                description: "name of edge",
                resolve(source) {
                    if (source.name ==null)  return source._id.split("/")[0];
                    else return source.name;
                }
            },
            from: {
                type: graphql.GraphQLNonNull(GraphQLString),
                description: "_from value",
                resolve(source) {
                    return source._from;
                }
            },
            to: {
                type: graphql.GraphQLNonNull(GraphQLString),
                description: "_to value",
                resolve(source) {
                    return source._to;
                }
            },
            rev: {
                type: graphql.GraphQLNonNull(GraphQLString),
                description: "_rev value",
                resolve(source) {
                    return source._rev;
                }
            }
            }
            }
})


const vertex = new graphql.GraphQLUnionType({
    name: "vertices",
    description: "list of vertices in a path or graph",
    types: [movieType, personType, userType, classType],
    resolveType(value) {
        let tokens = value._id.split("/");
        if (tokens[0] == "Movie") {
            return movieType;
        } else if (tokens[0] == "Person"){
            return personType;
        }else if (tokens[0] == "Class"){
            return classType;
        }else if (tokens[0] == "User"){
            return userType;
        }
    }
})

const arangoGraphType = new GraphQLObjectType({
    name: 'arangoGraphType',
    description: "arango graph",
    fields() {
        return {
            vertices: {
                type: graphql.GraphQLList(vertex),
                description: 'vertices',
                resolve(results) {
                    return results.vertices
                }
            },
            edges: {
                type: graphql.GraphQLList(edges),
                description: 'edges',
                resolve(results) {
                    return results.edges
                }
            },
            path: {
                type: new GraphQLObjectType({
                    name: 'path',
                    description: 'graph path',
                    fields() {
                        return {
                            edges: {
                                name: 'pathEdges',
                                type: graphql.GraphQLList(edges),
                                resolve(path) {
                                    return path.edges
                                }
                            },
                            vertices: {
                                name: 'pathVertices',
                                type: graphql.GraphQLList(vertex),
                                resolve(path) {
                                    return path.vertices
                                }
                            }
                        }
                    }
                })
            }
        }
    }
})

const recommendationType = new GraphQLObjectType({
    name: "recommendation",
    description: "List of movie recommendations",
    fields() {
        return {
            movie: {
                type: graphql.GraphQLNonNull(movieType),
                description: "Movie value",
                resolve(source) {
                    return source.movie;
                }
            },
            score: {
                type: graphql.GraphQLNonNull(GraphQLString),
                description: "movie user relevance score",
                resolve(source) {
                    return source.score;
                }
            }
        }
    }
})

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        hello: {
          type: GraphQLString,
          resolve() {
            return 'world';
          }
        },
          allClasses: {
              type: new graphql.GraphQLList(classType),
              description: "Classes",
              args: {
                  id: {
                      description: "_key for a class",
                      type: GraphQLString,
                      defaultValue: ""
                  },
                  limit: {
                      description: "limit number of results",
                      type: GraphQLInt,
                      defaultValue: 0
                  }
              },
              resolve(root, args) {
                  const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER c._key == "${args.id}" `);
                  const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

                  return db._query(aql`
              FOR c IN Class
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': c._key, 'name': c.name, 'description': c.description, 'collection' : c.collection}
              `);
              }
          },
          allModels: {
              type: new graphql.GraphQLList(modelType),
              description: "Models",
              args: {
                  id: {
                      description: "_key for a model",
                      type: GraphQLString,
                      defaultValue: ""
                  },
                  limit: {
                      description: "limit number of results",
                      type: GraphQLInt,
                      defaultValue: 0
                  }
              },
              resolve(root, args) {
                  const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER m._key == "${args.id}" `);
                  const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

                  return db._query(aql`
              FOR m IN Model
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': m._key, 'name': m.name, 'description': m.description, 'function' : m.function, 'components':m.components}
              `);
              }
          },
          ontologyGraph: {
              type: new graphql.GraphQLList(arangoGraphType),
              description: "Ontology",
              args: {
              },
              resolve(root, args) {
                  return db._query(aql`
              RETURN{
                vertices : (FOR class IN Class RETURN class), 
                edges : UNION((for rel in Relation RETURN rel),
                              (for rel in type RETURN rel),
                              (for rel in subClassOf RETURN rel)
                        )
                    } 
              `);
              }
          },
        allMovies: {
            type: new graphql.GraphQLList(movieType),
            description: "movies",
            args: {
                id: {
                    description: "_key for a movie",
                    type: GraphQLString,
                    defaultValue: ""
                },
                limit: {
                    description: "limit number of results",
                    type: GraphQLInt,
                    defaultValue: 0
                }
            },
            resolve(root, args) {
                const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER m._key == "${args.id}" `);
                const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

              return db._query(aql`
              FOR m IN Movie
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': m._key, 'title': m.title, 'overview': m.overview}
              `);
            }
          },
          allCompanies: {
              type: new graphql.GraphQLList(companyType),
              description: "companies",
              args: {
                  id: {
                      description: "_key for a company",
                      type: GraphQLString,
                      defaultValue: ""
                  },
                  limit: {
                    description: "limit number of results",
                    type: GraphQLInt,
                    defaultValue: 0
                }
              },
              resolve(root, args) {
                  const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER c._key == "${args.id}" `);
                  const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

                  return db._query(aql`
              FOR c IN Company
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': c._key, 'name': c.name}
              `);
              }
          },
          allGenres: {
              type: new graphql.GraphQLList(genreType),
              description: "genres",
              args: {
                  id: {
                      description: "_key for a genre",
                      type: GraphQLString,
                      defaultValue: ""
                  },
                  limit: {
                      description: "limit number of results",
                      type: GraphQLInt,
                      defaultValue: 0
                  }
              },
              resolve(root, args) {
                  const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER g._key == "${args.id}" `);
                  const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

                  return db._query(aql`
              FOR g IN Genre
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': g._key, 'name': g.name, 'description' : g.description}
              `);
              }
          },
          allPeople: {
              type: new graphql.GraphQLList(personType),
              description: "people",
              args: {
                  id: {
                      description: "_key for a person",
                      type: GraphQLString,
                      defaultValue: ""
                  },
                  limit: {
                    description: "limit number of results",
                    type: GraphQLInt,
                    defaultValue: 0
                }
              },
              resolve(root, args) {
                  const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER p._key == "${args.id}" `);
                  const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

                  return db._query(aql`
              FOR p IN Person
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': p._key, 'name': p.name}
              `);
              }
          },
          allUsers: {
              type: new graphql.GraphQLList(userType),
              description: "user",
              args: {
                  id: {
                      description: "_key for a user",
                      type: GraphQLString,
                      defaultValue: ""
                  },
                  limit: {
                    description: "limit number of results",
                    type: GraphQLInt,
                    defaultValue: 0
                }
              },
              resolve(root, args) {
                  const FILTER = args.id == "" ? aql.literal(``) : aql.literal(` FILTER u._key == "${args.id}" `);
                  const LIMIT = args.limit == 0 ? aql.literal(``) : aql.literal(` LIMIT ${args.limit} `);

                  return db._query(aql`
              FOR u IN User
              ${FILTER}
              ${LIMIT}
              RETURN {'_key': u._key, 'name': u.name}
              `);
              }
          },

          actorGraph: {
              type: graphql.GraphQLList(arangoGraphType),
              description: "returns graph of movies actor is in",
              args: {
                  id: {
                    description: "id of actor",
                    type: graphql.GraphQLNonNull(GraphQLString),
                  }
              },
              resolve(root, args) {
                  return db._query(aql`
                  FOR v, e, p IN 1..2 INBOUND ${args.id} hasActor
                    RETURN {"vertices": p.vertices, "edges": p.edges, "path": p}
                  `);
              }
          },
          recommendMoviesCollaborativeFilteringAQL: {
              type: new graphql.GraphQLList(recommendationType),
              description: "recommend movies using Collaborative Filtering implemented in AQL query",
              args: {
                  userId: {
                      description: "_key for a user",
                      type: GraphQLString,
                      defaultValue: "User/1"
                  },
                  similarUserLimit: {
                      description: "limit number of similar users considered",
                      type: GraphQLInt,
                      defaultValue: 5
                  },
                  movieRecommendationLimit: {
                      description: "limit number of movies recommended",
                      type: GraphQLInt,
                      defaultValue: 5
                  }
              },
              resolve(root, args) {
                  const userId = args.userId == "" ? aql.literal(``) : aql.literal(` "${args.userId}" `);
                  const similarUserLimit = args.similarUserLimit == 0 ? aql.literal(``) : aql.literal(` ${args.similarUserLimit} `);
                  const movieRecommendationLimit = args.movieRecommendationLimit == 0 ? aql.literal(``) : aql.literal(` ${args.movieRecommendationLimit} `);
                  return db._query(aql`
              WITH Movie, User, rates
              LET similarUsers =
                (FOR movie, edge IN 1 OUTBOUND  ${userId}  rates  // eg. userid = Users/1 GRAPH 'movie-knowledge-graph'
                    LET userA_ratings = edge.rating //TO_NUMBER(edge.ratings)
                    FOR userB, edge2 IN 1..1 INBOUND movie rates
                        FILTER userB._id != ${userId}
                        LET userB_ratings = edge2.rating //TO_NUMBER(edge2.ratings)
                        COLLECT userids=userB._id INTO g KEEP userB_ratings, userA_ratings
                        LET userA_len   = SQRT(SUM (FOR r IN g[*].userA_ratings RETURN r*r))
                        LET userB_len   = SQRT(SUM (FOR r IN g[*].userB_ratings RETURN r*r))
                        LET dot_product = SUM (FOR n IN 0..(LENGTH(g[*].userA_ratings) - 1) RETURN g[n].userA_ratings * g[n].userB_ratings)
                        LET cos_sim = dot_product/ (userA_len * userB_len)
                        SORT cos_sim DESC LIMIT ${similarUserLimit}
                        RETURN {userBs: userids,
                              cosine_similarity: cos_sim}
                )
            LET userA_RatedMovies = (FOR movie, edge IN 1..1 OUTBOUND ${userId} rates RETURN movie._key)
            FOR userB in similarUsers
                FOR movie ,ratesEdge IN 1..1 OUTBOUND userB.userBs rates 
                    FILTER movie._key NOT IN userA_RatedMovies
                    COLLECT userA_UnratedMovie = movie
                    AGGREGATE ratingSum = SUM(ratesEdge.rating)  
                    SORT ratingSum DESC
                    LIMIT ${movieRecommendationLimit}
                    RETURN  {movie: userA_UnratedMovie, score : ratingSum} 
              `);
              }
          },
          recommendMoviesContentBasedML: {
              type: new graphql.GraphQLList(recommendationType),
              description: "recommend movies using content based TFIDF inferences accessed in AQL",
              args: {
                  userId: {
                      description: "_key for a user",
                      type: GraphQLString,
                      defaultValue: "User/1"
                  },
                  topRatedMovieLimit: {
                      description: "limit number of users top rated movies considered",
                      type: GraphQLInt,
                      defaultValue: 100
                  },
                  movieRecommendationLimit: {
                      description: "limit number of movies recommended",
                      type: GraphQLInt,
                      defaultValue: 5
                  }
              },
              resolve(root, args) {
                  const userId = args.userId == "" ? aql.literal(``) : aql.literal(` "${args.userId}" `);
                  const topRatedMovieLimit = args.topRatedMovieLimit == 0 ? aql.literal(``) : aql.literal(` ${args.topRatedMovieLimit} `);
                  const movieRecommendationLimit = args.movieRecommendationLimit == 0 ? aql.literal(``) : aql.literal(` ${args.movieRecommendationLimit} `);
                  return db._query(aql`
WITH Movie
LET userRatedMovies = (FOR ratingEdge IN rates FILTER ratingEdge._from == ${userId} SORT  ratingEdge.rating DESC RETURN PARSE_IDENTIFIER(ratingEdge._to).key)
    FOR ratingEdge IN rates  
    FILTER ratingEdge._from == ${userId}
    SORT  ratingEdge.rating DESC 
    LIMIT ${topRatedMovieLimit} 
    LET similarMovies = DOCUMENT("MovieSimilarityTFIDF",PARSE_IDENTIFIER(ratingEdge._to).key)
    FILTER similarMovies != null
    FOR similarMovie IN similarMovies.similarMovies
        FILTER similarMovie NOT IN userRatedMovies //Don't recommend movies already rated
        //compound score is user rating factor * TFIDF similar movie score
        LET compoundScore = similarMovie.score*ratingEdge.rating/5.0 
        //Aggregate ratings for duplicate similar movies
        COLLECT recommendedMovie = similarMovie.movie AGGREGATE aggregateScore = MAX(compoundScore)
        SORT aggregateScore DESC
        LIMIT  ${movieRecommendationLimit}
        RETURN {movie : DOCUMENT("Movie",recommendedMovie) , score : aggregateScore} 
              `);
              }
          },
          recommendMoviesEmbeddingML: {
              type: new graphql.GraphQLList(recommendationType),
              description: "recommend movies using embeddings and similarity inferences accessed in AQL",
              args: {
                  userId: {
                      description: "_key for a user",
                      type: GraphQLString,
                      defaultValue: "User/1"
                  },
                  topRatedMovieLimit: {
                      description: "limit number of users top rated movies considered",
                      type: GraphQLInt,
                      defaultValue: 100
                  },
                  movieRecommendationLimit: {
                      description: "limit number of movies recommended",
                      type: GraphQLInt,
                      defaultValue: 5
                  }
              },
              resolve(root, args) {
                  const userId = args.userId == "" ? aql.literal(``) : aql.literal(` "${args.userId}" `);
                  const topRatedMovieLimit = args.topRatedMovieLimit == 0 ? aql.literal(``) : aql.literal(` ${args.topRatedMovieLimit} `);
                  const movieRecommendationLimit = args.movieRecommendationLimit == 0 ? aql.literal(``) : aql.literal(` ${args.movieRecommendationLimit} `);
                  return db._query(aql`
/*
This query uses the embedding inference computed using ML and transferred to ArangoDB in similarMovie_Embedding_Inference
The query works as follows:
Given a user, what movies are similar to the user's highest rated (topRatedLimit) movies and return the most similar movies the user has not rated.
*/

LET userRatedMovies = (FOR ratingEdge IN rates FILTER ratingEdge._from == ${userId} SORT  ratingEdge.rating DESC RETURN PARSE_IDENTIFIER(ratingEdge._to).key)
    FOR ratingEdge IN rates  
    FILTER ratingEdge._from == ${userId}
    SORT  ratingEdge.rating DESC 
    LIMIT ${topRatedMovieLimit} 
    FOR similarMovieEdge IN similarMovie_Embedding_Inference
        FILTER similarMovieEdge._from == ratingEdge._to
        LET similarMovie = similarMovieEdge._to
        FILTER similarMovie NOT IN userRatedMovies //Don't recommend movies already rated
        //compound score is user rating factor / distance - talk to data scientist on how to do this in amore scientific way
        LET compoundScore = (ratingEdge.rating/5.0)/similarMovieEdge.distance
        //Aggregate ratings for duplicate similar movies
        COLLECT recommendedMovie = similarMovie AGGREGATE aggregateScore = MAX(compoundScore)
        SORT aggregateScore DESC
        FILTER DOCUMENT(recommendedMovie)!=null//Temp Work-around while determine cause of nulls
        LIMIT  ${movieRecommendationLimit}
        RETURN {movie : DOCUMENT(recommendedMovie) , score : aggregateScore}
              `);
              }
          }
      }
    })
  });

module.exports = schema;