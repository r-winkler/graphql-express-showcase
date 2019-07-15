import express from 'express';
import graphQLHTTP from 'express-graphql';
import {personSchema} from './person-schema';
import {createRemoteExecutableSchema} from './remote-schema-creator';
import {mergeSchemas} from 'graphql-tools';



async function run() {

    const app = express();

    const countrySchema = await createRemoteExecutableSchema();

    const mergedSchema = mergeSchemas({
        schemas: [
            personSchema,
            countrySchema
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
