package ch.rewiso.javaspqrgraphqlgateway.person;

import io.leangen.graphql.annotations.*;
import io.leangen.graphql.execution.ResolutionEnvironment;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import org.dataloader.DataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@GraphQLApi
@Service
public class PersonService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String PERSONS_ENDPOINT = "http://localhost:3000/persons/";

    @GraphQLQuery(name = "person")
    public CompletableFuture<PersonDTO> findById(@GraphQLNonNull @GraphQLArgument(name = "id") Long id, @GraphQLEnvironment ResolutionEnvironment environment) {
        DataLoader<Long, PersonDTO> dataLoader = environment.dataFetchingEnvironment.getDataLoader("person");
        return dataLoader.load(id);
    }

    public List<PersonDTO> findByIds(List<Long> ids) {
        System.out.println("Call ids: " + ids.toString());
        ResponseEntity<List<PersonDTO>> response = restTemplate.exchange(
                PERSONS_ENDPOINT,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<PersonDTO>>(){});
        // FIXME: this should be solved via rest api
        return response.getBody().stream().filter(dto -> ids.contains(dto.getId())).collect(Collectors.toList());
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
    public CompletableFuture<List<PersonDTO>> getFriends(@GraphQLContext PersonDTO personDTO, @GraphQLEnvironment ResolutionEnvironment environment) {
        List<Long> friendIds = personDTO.getFriends();
        DataLoader<Long, PersonDTO> dataLoader = environment.dataFetchingEnvironment.getDataLoader("person");
        return dataLoader.loadMany(friendIds);
    }

}
