import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { ApolloClient, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import { EmptyObject, ExtraSubscriptionOptions } from './types';

export declare namespace Subscription {
  export type SubscribeOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<ApolloClient.SubscribeOptions<TData, TVariables>, 'query'>;
}

@Injectable()
export abstract class Subscription<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<TData, TVariables>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public subscribe(
    ...[options, extra]: {} extends TVariables
      ? [
          options?: Subscription.SubscribeOptions<TData, TVariables>,
          extra?: ExtraSubscriptionOptions,
        ]
      : [
          options: Subscription.SubscribeOptions<TData, TVariables>,
          extra?: ExtraSubscriptionOptions,
        ]
  ): Observable<ApolloClient.SubscribeResult<TData>> {
    return this.apollo.use(this.client).subscribe<TData, TVariables>(
      {
        ...options,
        query: this.document,
      } as ApolloClient.SubscribeOptions<TData, TVariables>,
      extra,
    );
  }
}
