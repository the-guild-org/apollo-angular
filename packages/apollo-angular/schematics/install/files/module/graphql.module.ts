import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, NgModule } from '@angular/core';
import { InMemoryCache, ApolloClient } from "@apollo/client";

export function createApollo(): ApolloClient.Options<any> {
  const uri = '<%= endpoint %>'; // <-- add the URL of the GraphQL server here
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [provideApollo(createApollo)],
})
export class GraphQLModule {}
