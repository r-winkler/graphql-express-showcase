import express from 'express';
import graphQLHTTP from 'express-graphql';
import {personSchema} from './person-schema';
import {createRemoteExecutableSchema} from './remote-schema-creator';
import {mergeSchemas} from 'graphql-tools';


const COUNTRIES_URL = 'https://countries.trevorblades.com';
// const DEUTSCHE_BAHN_URL = 'https://bahnql.herokuapp.com/graphql';


async function run() {

    const app = express();

    const countrySchema = await createRemoteExecutableSchema(COUNTRIES_URL);
    // const deutscheBahnSchema = await createRemoteExecutableSchema(DEUTSCHE_BAHN_URL);

    const mergedSchema = mergeSchemas({
        schemas: [
            personSchema,
            countrySchema,
            // deutscheBahnSchema
        ],
    });

    app.use(graphQLHTTP({
        schema: mergedSchema,
        graphiql: true
    }));

    app.listen(5000);
}


try {
    run()
}
catch (e) {
    console.log(e)
}
