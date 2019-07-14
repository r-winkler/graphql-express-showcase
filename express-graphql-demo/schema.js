var {
    GraphQLInt, GraphQLList,
    GraphQLObjectType,
    GraphQLSchema, GraphQLString
} = require('graphql');
var {
    makeRemoteExecutableSchema,
    introspectSchema,
    mergeSchemas
} = require('graphql-tools');

var {HttpLink} = require('apollo-link-http');
var fetch = require('node-fetch');
var { createApolloFetch } = require('apollo-fetch');


var axios = require("axios");

/**
 * FIRST SCHEMA => local schema
 */


var PERSONS_URL = 'http://localhost:3000';

function getPersonById(id) {
    return axios(`${PERSONS_URL}/persons/${id}`).then(res => res.data);
}

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'person description',

    fields: () => ({
        id: {type: GraphQLString},
        firstname: {type: GraphQLString},
        lastname: {type: GraphQLString},
        age: {type: GraphQLInt},
        gender: {type: GraphQLString},
        picture: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        address: {type: GraphQLString},
        friends: {
            type: new GraphQLList(PersonType),
            resolve: (person) => person.friends.map(getPersonById)
        },
        countryCode: {type: GraphQLString}
    })
});

var QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'query description',

    fields: () => ({
        person: {
            type: PersonType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (root, args) => getPersonById(args.id)
        },
        allPersons: {
            type: new GraphQLList(PersonType),
            resolve: () => axios(`${PERSONS_URL}/persons/`).then(res => res.data)
        }
    })
});


var schema1 = new GraphQLSchema({
    query: QueryType
});


/**
 * SECOND SCHEMA => remote schema
 */


var COUNTRIES_URL = 'https://countries.trevorblades.com';


const fetcher = createApolloFetch({ uri: COUNTRIES_URL});

const createRemoteExecutableSchema = async () => {

    // Create Apollo link with URI and headers of the GraphQL API
    const link = new HttpLink({
        uri: COUNTRIES_URL,
        fetch
    });
    // Introspect schema
    console.log('schema5')
    // Make remote executable schema
    const remoteExecutableSchema = makeRemoteExecutableSchema({
        schema: await introspectSchema(fetcher),
        fetcher
    });
    console.log('schema6')

    return remoteExecutableSchema;
};

const createNewSchema = async () => {
    console.log('schema')
    const schema2 = await createRemoteExecutableSchema();
    console.log('schema2')
    return mergeSchemas({
        schemas: [
            schema1,
            schema2
        ],
    });
};


module.exports.createNewSchema = createNewSchema;

