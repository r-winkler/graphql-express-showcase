import {makeRemoteExecutableSchema, introspectSchema} from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';

import fetch from 'node-fetch'



const COUNTRIES_URL = 'https://countries.trevorblades.com';



export const createRemoteExecutableSchema = async () => {

    // Create Apollo link with URI and headers of the GraphQL API

    const link = createHttpLink({
        uri: COUNTRIES_URL,
        fetch
    });
    // Introspect schema
    const schema = await introspectSchema(link);

    // Make remote executable schema
    const remoteExecutableSchema = makeRemoteExecutableSchema({
        schema: schema,
        link
    });
    console.log('Remote schema successfully created');

    return remoteExecutableSchema;
};



module.exports = {createRemoteExecutableSchema};