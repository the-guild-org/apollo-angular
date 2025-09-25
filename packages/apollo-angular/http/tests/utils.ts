import { Observable } from 'rxjs';
import { ApolloClient, ApolloLink, execute, InMemoryCache } from '@apollo/client';

export function createDefaultExecuteContext(): ApolloLink.ExecuteContext {
  return {
    client: new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.empty(),
    }),
  };
}

export function executeWithDefaultContext(
  link: ApolloLink,
  request: ApolloLink.Request,
  context: ApolloLink.ExecuteContext = createDefaultExecuteContext(),
): Observable<ApolloLink.Result> {
  return execute(link, request, context);
}
