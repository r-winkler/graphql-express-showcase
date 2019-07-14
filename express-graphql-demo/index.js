var express = require('express');
var graphQLHTTP = require('express-graphql');
var schema = require('./schema');

var app = express();

app.use(graphQLHTTP({
    schema,
    graphiql: true
}));

app.listen(5000);
