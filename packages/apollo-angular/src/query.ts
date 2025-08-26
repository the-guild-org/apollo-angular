import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { ApolloClient, OperationVariables, TypedDocumentNode } from '@apollo/client';
import { Apollo } from './apollo';
import { QueryRef } from './query-ref';
import { EmptyObject, QueryOptionsAlone, WatchQueryOptionsAlone } from './types';

@Injectable()
export abstract class Query<T = {}, V extends OperationVariables = EmptyObject> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public watch(variables?: V, options?: WatchQueryOptionsAlone<V, T>): QueryRef<T, V> {
    return this.apollo.use(this.client).watchQuery<T, V>({
      ...options,
      variables: variables as V,
      query: this.document,
    });
  }

  public fetch(
    variables?: V,
    options?: QueryOptionsAlone<V, T>,
  ): Observable<ApolloClient.QueryResult<T>> {
    return this.apollo.use(this.client).query<T, V>({
      ...options,
      variables: variables as V,
      query: this.document,
    });
  }
}
