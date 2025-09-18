import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { ApolloClient, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import { QueryRef } from './query-ref';
import { EmptyObject, QueryOptionsAlone, WatchQueryOptionsAlone } from './types';

@Injectable()
export abstract class Query<TData = unknown, TVariables extends OperationVariables = EmptyObject> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<TData, TVariables>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public watch(
    variables?: TVariables,
    options?: WatchQueryOptionsAlone<TData, TVariables>,
  ): QueryRef<TData, TVariables> {
    return this.apollo.use(this.client).watchQuery<TData, TVariables>({
      ...options,
      variables: variables as TVariables,
      query: this.document,
    });
  }

  public fetch(
    variables?: TVariables,
    options?: QueryOptionsAlone<TData, TVariables>,
  ): Observable<ApolloClient.QueryResult<TData>> {
    return this.apollo.use(this.client).query<TData, TVariables>({
      ...options,
      variables: variables as TVariables,
      query: this.document,
    });
  }
}
