import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import type { OperationVariables, TypedDocumentNode } from '@apollo/client/core';
import { Apollo } from './apollo';
import type { EmptyObject, MutationOptionsAlone, MutationResult } from './types';

@Injectable()
export abstract class Mutation<T = {}, V extends OperationVariables = EmptyObject> {
  public abstract readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected readonly apollo: Apollo) {}

  public mutate(
    variables?: V,
    options?: MutationOptionsAlone<T, V>,
  ): Observable<MutationResult<T>> {
    return this.apollo.use(this.client).mutate<T, V>({
      ...options,
      variables: variables as V,
      mutation: this.document,
    });
  }
}
