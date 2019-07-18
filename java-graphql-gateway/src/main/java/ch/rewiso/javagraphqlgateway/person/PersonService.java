package ch.rewiso.javagraphqlgateway.person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class PersonService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String PERSONS_ENDPOINT = "http://localhost:3000/persons/";

    public PersonDTO findById(Long id) {
        ResponseEntity<PersonDTO> response =  restTemplate.getForEntity(PERSONS_ENDPOINT + id, PersonDTO.class);
        return response.getBody();
    }

    public List<PersonDTO> findAll() {
        ResponseEntity<List<PersonDTO>> response = restTemplate.exchange(
                PERSONS_ENDPOINT,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<PersonDTO>>(){});
        return response.getBody();
    }
}
