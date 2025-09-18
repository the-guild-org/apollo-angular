import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import type { EmptyObject, MutationOptionsAlone, MutationResult } from './types';

@Injectable()
export abstract class Mutation<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<TData, TVariables>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public mutate(
    variables?: TVariables,
    options?: MutationOptionsAlone<TData, TVariables>,
  ): Observable<MutationResult<TData>> {
    return this.apollo.use(this.client).mutate<TData, TVariables>({
      ...options,
      variables: variables as TVariables,
      mutation: this.document,
    });
  }
}
