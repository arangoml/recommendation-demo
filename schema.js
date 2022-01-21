// const gql = require('graphql-sync'); // 0.12 or later
const graphql = require("graphql");
const {GraphQLInt, GraphQLFloat, GraphQLEnumType} = require("graphql");
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLString = graphql.GraphQLString;
const GraphQLObjectType = graphql.GraphQLObjectType;

const db = require('@arangodb').db;
const aql = require("@arangodb").aql;


const movieType = new GraphQLObjectType({
    name: "Movie",
    description: "Movie Type",
    fields() {
        return {
            id: {
                type: new graphql.GraphQLNonNull(GraphQLString),
                description: "The id of the movie",
                resolve(movie) {
                    return movie._key;
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
            releaseDate: {
                type: GraphQLString,
                description: "The movie releaseDate"
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
          }
      }
    })
  });

module.exports = schema;