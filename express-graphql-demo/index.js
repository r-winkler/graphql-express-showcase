const express = require('express');
const graphQLHTTP = require('express-graphql');
const {personSchema} = require('./person-schema');
const {createRemoteExecutableSchema} = require('./remote-schema-creator');
const {mergeSchemas} = require('graphql-tools');



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
