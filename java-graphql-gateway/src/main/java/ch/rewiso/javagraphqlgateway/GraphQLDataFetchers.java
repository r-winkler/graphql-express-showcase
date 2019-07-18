package ch.rewiso.javagraphqlgateway;

import ch.rewiso.javagraphqlgateway.country.CountryService;
import ch.rewiso.javagraphqlgateway.person.PersonDTO;
import ch.rewiso.javagraphqlgateway.person.PersonService;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GraphQLDataFetchers {

    @Autowired
    private PersonService personService;

    @Autowired
    private CountryService countryService;

    public DataFetcher getPersonByIdDataFetcher() {
        return dataFetchingEnvironment -> {
            String id = dataFetchingEnvironment.getArgument("id");
            return personService.findById(Long.valueOf(id));
        };
    }

    public DataFetcher getAllPersonsDataFetcher() {
        return dataFetchingEnvironment -> personService.findAll();
    }


    public DataFetcher getFriendsDataFetcher() {
        return dataFetchingEnvironment -> {
            PersonDTO personDTO = dataFetchingEnvironment.getSource();
            List<Long> friendIds = personDTO.getFriends();
            return friendIds.stream().map(friendId -> personService.findById(Long.valueOf(friendId))).collect(Collectors.toList());
        };
    }

    public DataFetcher getCountryDataFetcher() {
        return dataFetchingEnvironment -> {
            PersonDTO personDTO = dataFetchingEnvironment.getSource();
            String countryCode = personDTO.getCountryCode();
            String selectionSet = String.join(",", dataFetchingEnvironment.getSelectionSet().get().keySet());
            return countryService.findByCode(countryCode, selectionSet);
        };
    }

}
