import { DocumentNode } from 'graphql';
import type { GraphQLRequest } from '@apollo/client/link/core/types';
import { getOperationName } from "@apollo/client/utilities/internal";

export function buildOperationForLink<TVariables = Record<string, any>>(
  document: DocumentNode,
  variables: TVariables,
): GraphQLRequest<TVariables> {
  return {
    query: document,
    variables,
    operationName: getOperationName(document) || undefined,
    context: {},
  };
}
