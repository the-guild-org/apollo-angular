import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';
import { ApolloClient, execute, InMemoryCache, OperationVariables } from "@apollo/client";
import { ApolloLink } from '@apollo/client/link';
import { addTypenameToDocument } from '@apollo/client/utilities';

export function buildOperationForLink(
  document: DocumentNode,
  variables: OperationVariables | undefined,
): ApolloLink.Request {
  return {
    query: addTypenameToDocument(document),
    variables,
    context: {},
  };
}

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
