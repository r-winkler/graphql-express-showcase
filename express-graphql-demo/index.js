var express = require('express');
var graphQLHTTP = require('express-graphql');
var {createNewSchema} = require('./schema');



async function run() {

    var app = express();

    var schema = await createNewSchema();

    app.use(graphQLHTTP({
        schema,
        graphiql: true
    }));

    app.listen(5000);
}

run();
