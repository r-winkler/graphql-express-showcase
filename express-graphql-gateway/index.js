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


    const linkSchemaDefs = `
		extend type Person {
			country: Country
		}`;

    const mergedSchema = mergeSchemas({
        schemas: [
            personSchema,
            countrySchema,
            linkSchemaDefs
            // deutscheBahnSchema
        ],
        resolvers: mergeInfo => ({
            Person: {
                country: {
                    fragment: `fragment CountryFragment on Person {countryCode}`,
                    resolve(parent, args, context, info) {
                        console.log(args)
                        const countryCode = parent.countryCode;
                        return mergeInfo.delegate(
                            'query',
                            'country',
                            {'code': countryCode},
                            context,
                            info
                        )
                    }
                }
            }
        })
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
