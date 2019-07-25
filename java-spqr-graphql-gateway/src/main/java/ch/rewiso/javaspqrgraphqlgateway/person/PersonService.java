package ch.rewiso.javaspqrgraphqlgateway.person;

import ch.rewiso.javaspqrgraphqlgateway.country.CountryDTO;
import graphql.GraphQL;
import io.leangen.graphql.annotations.GraphQLArgument;
import io.leangen.graphql.annotations.GraphQLContext;
import io.leangen.graphql.annotations.GraphQLNonNull;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@GraphQLApi
@Service
public class PersonService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String PERSONS_ENDPOINT = "http://localhost:3000/persons/";

    @GraphQLQuery(name = "person")
    public PersonDTO findById(@GraphQLNonNull @GraphQLArgument(name = "id") Long id) {
        ResponseEntity<PersonDTO> response =  restTemplate.getForEntity(PERSONS_ENDPOINT + id, PersonDTO.class);
        return response.getBody();
    }


    @GraphQLQuery(name = "allPersons")
    public @GraphQLNonNull List<PersonDTO> findAll() {
        ResponseEntity<List<PersonDTO>> response = restTemplate.exchange(
                PERSONS_ENDPOINT,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<PersonDTO>>(){});
        return response.getBody();
    }


    @GraphQLQuery(name = "friends")
    public List<PersonDTO> getFriends(@GraphQLContext PersonDTO personDTO) {
        List<Long> friendIds = personDTO.getFriends();
        return friendIds.stream().map(friendId -> this.findById(friendId)).collect(Collectors.toList());
    }

}
