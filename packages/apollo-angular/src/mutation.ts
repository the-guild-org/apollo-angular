import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { OperationVariables, TypedDocumentNode } from '@apollo/client';
import { Apollo } from './apollo';
import type { EmptyObject } from './types';

export declare namespace Mutation {
  export type MutateOptions<
    TData = unknown,
    TVariables extends OperationVariables = EmptyObject,
  > = Omit<Apollo.MutateOptions<TData, TVariables>, 'mutation'>;
}

@Injectable()
export abstract class Mutation<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<TData, TVariables>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public mutate(
    ...[options]: {} extends TVariables
      ? [options?: Mutation.MutateOptions<TData, TVariables>]
      : [options: Mutation.MutateOptions<TData, TVariables>]
  ): Observable<Apollo.MutateResult<TData>> {
    return this.apollo.use(this.client).mutate<TData, TVariables>({
      ...options,
      mutation: this.document,
    } as Apollo.MutateOptions<TData, TVariables>);
  }
}
