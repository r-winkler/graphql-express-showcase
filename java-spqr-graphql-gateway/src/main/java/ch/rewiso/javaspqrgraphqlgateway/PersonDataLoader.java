package ch.rewiso.javaspqrgraphqlgateway;

import ch.rewiso.javaspqrgraphqlgateway.person.PersonDTO;
import ch.rewiso.javaspqrgraphqlgateway.person.PersonService;
import io.leangen.graphql.spqr.spring.autoconfigure.DataLoaderRegistryFactory;
import org.dataloader.BatchLoader;
import org.dataloader.DataLoader;
import org.dataloader.DataLoaderOptions;
import org.dataloader.DataLoaderRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

@Component
// so that results are not cached all the time but only for one request. This maybe not optimal,
// see here for details: https://github.com/graphql-java-kickstart/graphql-java-tools/issues/58
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PersonDataLoader implements DataLoaderRegistryFactory {

    @Autowired
    private PersonService personService;

    private BatchLoader<Long, PersonDTO> personBatchLoader = new BatchLoader<Long, PersonDTO>() {
        @Override
        public CompletionStage<List<PersonDTO>> load(List<Long> ids) {
            return CompletableFuture.supplyAsync(() -> personService.findByIds(ids));
        }
    };

    DataLoaderOptions options = DataLoaderOptions.newOptions().setBatchingEnabled(true);
    private DataLoader<Long, PersonDTO> personDataLoader = DataLoader.newDataLoader(personBatchLoader, options);


    @Override
    public DataLoaderRegistry createDataLoaderRegistry() {

        DataLoaderRegistry registry = new DataLoaderRegistry();
        registry.register("person", personDataLoader);
        return registry;
    }
}
