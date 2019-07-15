import {makeRemoteExecutableSchema, introspectSchema} from 'graphql-tools';
import { createHttpLink } from 'apollo-link-http';

import fetch from 'node-fetch'


export const createRemoteExecutableSchema = async (uri) => {


    const link = createHttpLink({
        uri: uri,
        fetch
    });

    const schema = await introspectSchema(link);

    const remoteExecutableSchema = makeRemoteExecutableSchema({
        schema: schema,
        link
    });
    console.log('Remote schema successfully created');

    return remoteExecutableSchema;
};
