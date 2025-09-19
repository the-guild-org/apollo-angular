import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { Apollo } from './apollo';
import { EmptyObject } from './types';

export declare namespace Subscription {
  export type SubscribeOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<Apollo.SubscribeOptions<TData, TVariables>, 'query'>;
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
    ...[options]: {} extends TVariables
      ? [options?: Subscription.SubscribeOptions<TData, TVariables>]
      : [options: Subscription.SubscribeOptions<TData, TVariables>]
  ): Observable<Apollo.SubscribeResult<TData>> {
    return this.apollo.use(this.client).subscribe<TData, TVariables>({
      ...options,
      query: this.document,
    } as Apollo.SubscribeOptions<TData, TVariables>);
  }
}
