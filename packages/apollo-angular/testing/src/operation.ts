import { GraphQLFormattedError, OperationTypeNode } from 'graphql';
import { Observer } from 'rxjs';
import { ApolloLink, ErrorLike } from "@apollo/client";
import { isErrorLike } from '@apollo/client/errors';

export type Operation = ApolloLink.Operation & {
  clientName: string;
};

export class TestOperation<T = { [key: string]: any }> {
  constructor(
    public readonly operation: Operation,
    private readonly observer: Observer<ApolloLink.Result<T>>,
  ) {}

  public flush(result: ApolloLink.Result<T> | ErrorLike): void {
    if (isErrorLike(result)) {
      this.observer.error(result);
    } else {
      const fetchResult = result ? { ...result } : result;
      this.observer.next(fetchResult);

      if (this.operation.operationType !== OperationTypeNode.SUBSCRIPTION) {
        this.complete();
      }
    }
  }

  public complete() {
    this.observer.complete();
  }

  public flushData(data: T | null): void {
    this.flush({ data });
  }

  public networkError(error: ErrorLike): void {
    this.flush(error);
  }

  public graphqlErrors(errors: GraphQLFormattedError[]): void {
    this.flush({
      errors,
    });
  }
}
