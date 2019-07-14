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

var {createHttpLink} = require('apollo-link-http');
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
//var COUNTRIES_URL = 'http://api.githunt.com/graphql';
//var COUNTRIES_URL = 'https://bahnql.herokuapp.com/graphql';


const createRemoteExecutableSchema = async () => {

    // Create Apollo link with URI and headers of the GraphQL API

    const link = createHttpLink({
        uri: COUNTRIES_URL,
        fetch
    });
    // Introspect schema
    let schema;
    try {
        schema = await introspectSchema(link);
        console.log(schema)
    }
    catch (e) {
        console.log(e)
    }

    // Make remote executable schema
    const remoteExecutableSchema = makeRemoteExecutableSchema({
        schema: schema,
        fetch
    });
    console.log('Remote schema successfully created');

    return remoteExecutableSchema;
};

const createNewSchema = async () => {
    const schema2 = await createRemoteExecutableSchema();
    return mergeSchemas({
        schemas: [
            schema1,
            schema2

        ],
    });
};


module.exports.createNewSchema = createNewSchema;

