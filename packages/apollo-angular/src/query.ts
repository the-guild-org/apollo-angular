import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { Apollo } from './apollo';
import { QueryRef } from './query-ref';
import { EmptyObject } from './types';

export declare namespace Query {
  export type WatchOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<Apollo.WatchQueryOptions<TData, TVariables>, 'query'>;

  export type FetchOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<Apollo.QueryOptions<TData, TVariables>, 'query'>;
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
    } as Apollo.WatchQueryOptions<TData, TVariables>);
  }

  public fetch(
    ...[options]: {} extends TVariables
      ? [options?: Query.FetchOptions<TData, TVariables>]
      : [options: Query.FetchOptions<TData, TVariables>]
  ): Observable<Apollo.QueryResult<TData>> {
    return this.apollo.use(this.client).query<TData, TVariables>({
      ...options,
      query: this.document,
    } as Apollo.QueryOptions<TData, TVariables>);
  }
}
