import express from 'express';
import graphQLHTTP from 'express-graphql';
import {getPersonById, personSchema} from './person-schema';
import {createRemoteExecutableSchema} from './remote-schema-creator';
import {mergeSchemas} from 'graphql-tools';
import DataLoader from 'dataloader'


const COUNTRIES_URL = 'https://countries.trevorblades.com';

async function run() {

    const app = express();

    const countrySchema = await createRemoteExecutableSchema(COUNTRIES_URL);


    const linkSchemaDefs = `
		extend type Person {
			country: Country
		}`;

    const mergedSchema = mergeSchemas({
        schemas: [
            personSchema,
            countrySchema,
            linkSchemaDefs
        ],
        resolvers: {
            Person: {
                country: {
                    fragment: `fragment CountryFragment on Person {countryCode}`,
                    resolve(parent, args, context, info) {
                        const countryCode = parent.countryCode;

                        return info.mergeInfo.delegateToSchema({
                                schema: countrySchema,
                                operation: 'query',
                                fieldName: 'country',
                                args: {'code': countryCode},
                                context: context,
                                info: info
                            }
                        )
                    }
                }
            }
        }
    });

    app.use(graphQLHTTP( req => {

        const personLoader = new DataLoader(
            keys => Promise.all(keys.map(getPersonById))
        );
        const loaders = {
            person: personLoader
        };
        return {
            context: {loaders},
            schema: mergedSchema,
            graphiql: true
        }
    }));

    app.listen(5000);
}


try {
    run()
}
catch (e) {
    console.log(e)
}
