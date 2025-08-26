import { DocumentNode } from 'graphql';
import { OperationVariables } from '@apollo/client';
import type { ApolloLink } from '@apollo/client/link';

export function buildOperationForLink(
  document: DocumentNode,
  variables: OperationVariables | undefined,
): ApolloLink.Request {
  return {
    query: document,
    variables,
    context: {},
  };
}
