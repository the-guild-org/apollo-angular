import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { ApolloClient, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import { EmptyObject, ExtraSubscriptionOptions, SubscriptionOptionsAlone } from './types';

@Injectable()
export abstract class Subscription<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<TData, TVariables>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public subscribe(
    variables?: TVariables,
    options?: SubscriptionOptionsAlone<TData, TVariables>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<ApolloClient.SubscribeResult<TData>> {
    return this.apollo.use(this.client).subscribe<TData, TVariables>(
      {
        ...options,
        variables: variables as TVariables,
        query: this.document,
      },
      extra,
    );
  }
}
