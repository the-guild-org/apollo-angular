import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { ApolloClient, OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import { EmptyObject, ExtraSubscriptionOptions, SubscriptionOptionsAlone } from './types';

@Injectable()
export abstract class Subscription<T = unknown, V extends OperationVariables = EmptyObject> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public subscribe(
    variables?: V,
    options?: SubscriptionOptionsAlone<T, V>,
    extra?: ExtraSubscriptionOptions,
  ): Observable<ApolloClient.SubscribeResult<T>> {
    return this.apollo.use(this.client).subscribe<T, V>(
      {
        ...options,
        variables: variables as V,
        query: this.document,
      },
      extra,
    );
  }
}
