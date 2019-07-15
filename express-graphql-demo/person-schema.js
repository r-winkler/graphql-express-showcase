const {
    GraphQLInt, GraphQLList,
    GraphQLObjectType,
    GraphQLSchema, GraphQLString} = require('graphql');

const axios = require("axios");


const PERSONS_URL = 'http://localhost:3000';

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

const QueryType = new GraphQLObjectType({
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


const personSchema = new GraphQLSchema({
    query: QueryType
});



module.exports = {personSchema};

