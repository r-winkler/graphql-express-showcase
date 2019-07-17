# graphql-gateway

Showcase for a GraphQL gateway implemented with node and express.

The Gateway combines an internal Rest api and an external GraphQL endpoint.

### Endpoints

- Gateway: localhost:5000
- Person Rest: http://localhost:3000/persons
- Country GraphQL: https://countries.trevorblades.com

#### Example query

`
{
  allPersons {
    firstname
    lastname
    age
    friends {
      firstname
      lastname
    }
    country {
      name
    }  
  }
}
`

Inspired by 

* Zero to GraphQL (https://www.youtube.com/watch?v=UBGzsb2UkeY&t=1408s)
* GraphQL schema stitching (https://blog.apollographql.com/graphql-schema-stitching-8af23354ac37)
