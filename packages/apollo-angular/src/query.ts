import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { ApolloClient, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import { QueryRef } from './query-ref';
import { EmptyObject, WatchQueryOptions } from './types';

export declare namespace Query {
  export type WatchOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<WatchQueryOptions<TData, TVariables>, 'query'>;

  export type FetchOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<ApolloClient.QueryOptions<TData, TVariables>, 'query'>;
}

@Injectable()
export abstract class Query<TData = unknown, TVariables extends OperationVariables = EmptyObject> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<TData, TVariables>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public watch(
    ...[options]: {} extends TVariables
      ? [options?: Query.WatchOptions<TData, TVariables>]
      : [options: Query.WatchOptions<TData, TVariables>]
  ): QueryRef<TData, TVariables> {
    return this.apollo.use(this.client).watchQuery<TData, TVariables>({
      ...options,
      query: this.document,
    } as ApolloClient.WatchQueryOptions<TData, TVariables>);
  }

  public fetch(
    ...[options]: {} extends TVariables
      ? [options?: Query.FetchOptions<TData, TVariables>]
      : [options: Query.FetchOptions<TData, TVariables>]
  ): Observable<ApolloClient.QueryResult<TData>> {
    return this.apollo.use(this.client).query<TData, TVariables>({
      ...options,
      query: this.document,
    } as ApolloClient.QueryOptions<TData, TVariables>);
  }
}
