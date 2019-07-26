package ch.rewiso.javaspqrgraphqlgateway;

import ch.rewiso.javaspqrgraphqlgateway.person.PersonDTO;
import ch.rewiso.javaspqrgraphqlgateway.person.PersonService;
import io.leangen.graphql.spqr.spring.autoconfigure.DataLoaderRegistryFactory;
import org.dataloader.BatchLoader;
import org.dataloader.DataLoader;
import org.dataloader.DataLoaderOptions;
import org.dataloader.DataLoaderRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class PersonDataLoader implements DataLoaderRegistryFactory {

    @Autowired
    private PersonService personService = new PersonService();

    private BatchLoader<Long, PersonDTO> personBatchLoader = ids -> CompletableFuture.supplyAsync(() -> personService.findByIds(ids));

    @Override
    public DataLoaderRegistry createDataLoaderRegistry() {

        /**
         * IMPORTANT: as long as the creation of the dataloader is placed inside this method here, it gets newly created on every request.
         * Probably this is what you want ;-) If the creation is not placed here, the dataloader is shared cross the requests and so its cache.
         * This means results from previous requests are still cached and returned as results.
         */
        DataLoaderOptions options = DataLoaderOptions.newOptions().setBatchingEnabled(true);
        DataLoader<Long, PersonDTO> personDataLoader = DataLoader.newDataLoader(personBatchLoader, options);

        DataLoaderRegistry registry = new DataLoaderRegistry();
        registry.register("person", personDataLoader);
        return registry;
    }

}
