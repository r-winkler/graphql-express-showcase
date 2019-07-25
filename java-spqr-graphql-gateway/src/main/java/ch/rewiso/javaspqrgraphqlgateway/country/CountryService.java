package ch.rewiso.javaspqrgraphqlgateway.country;

import ch.rewiso.javaspqrgraphqlgateway.person.PersonDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import io.leangen.graphql.annotations.GraphQLContext;
import io.leangen.graphql.annotations.GraphQLEnvironment;
import io.leangen.graphql.annotations.GraphQLQuery;
import io.leangen.graphql.execution.ResolutionEnvironment;
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Collections;

@GraphQLApi
@Service
public class CountryService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper mapper;

    private static final String COUNTRY_ENDPOINT = "https://countries.trevorblades.com/";


    @GraphQLApi
    @GraphQLQuery(name = "country")
    public CountryDTO getCountry(@GraphQLContext PersonDTO personDTO, @GraphQLEnvironment ResolutionEnvironment environment) throws IOException {
        String countryCode = personDTO.getCountryCode();
        String selectionSet = String.join(",", environment.dataFetchingEnvironment.getSelectionSet().get().keySet());
        CountryDTO countryDTO = this.findByCode(countryCode, selectionSet);
        return countryDTO;
    }

    public CountryDTO findByCode(String code, String selectionSet) throws IOException {

        // Install Graphql Playground, enter your query, open developer tools (->window -> toggle developer tools), click 'play', see network request (headers -> request payload -> view source), copy payload here
        String query = "query getCountryByCode($code: String) {\n  country(code: $code) {\n    " + selectionSet + "\n  }\n}\n";
        String country = graphqlRequest(query, ImmutableMap.of("code", code));
        return mapper.readValue(country, CountryDTO.class);
    }


    private String graphqlRequest(String query, ImmutableMap variables) throws IOException {

        ImmutableMap queryMap = ImmutableMap.of("query", query );
        ImmutableMap variablesMap = ImmutableMap.of("variables", variables);

        ImmutableMap body = ImmutableMap.builder().putAll(queryMap).putAll(variablesMap).build();

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        HttpEntity<ImmutableMap> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(
                COUNTRY_ENDPOINT,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<String>(){});
        JsonNode root = mapper.readTree(response.getBody());
        return root.path("data").path("country").toString();
    }
}
