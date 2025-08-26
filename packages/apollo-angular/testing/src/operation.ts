import { FormattedExecutionResult, GraphQLError, Kind, OperationTypeNode } from 'graphql';
import { Observer } from 'rxjs';
import { ApolloLink } from "@apollo/client";
import { ApolloError } from "@apollo/client/v4-migration";
import { getMainDefinition } from '@apollo/client/utilities';

const isApolloError = (err: any): err is ApolloError => err && err.hasOwnProperty('graphQLErrors');

export type Operation = ApolloLink.Operation & {
  clientName: string;
};

export class TestOperation<T = { [key: string]: any }> {
  constructor(
    public readonly operation: Operation,
    private readonly observer: Observer<ApolloLink.Result<T>>,
  ) {}

  public flush(result: FormattedExecutionResult<T> | ApolloError): void {
    if (isApolloError(result)) {
      this.observer.error(result);
    } else {
      const fetchResult = result ? { ...result } : result;
      this.observer.next(fetchResult);

      const definition = getMainDefinition(this.operation.query);

      if (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation !== OperationTypeNode.SUBSCRIPTION
      ) {
        this.complete();
      }
    }
  }

  public complete() {
    this.observer.complete();
  }

  public flushData(data: T | null): void {
    this.flush({
      data,
    });
  }

  public networkError(error: Error): void {
    const apolloError = new ApolloError({
      networkError: error,
    });

    this.flush(apolloError);
  }

  public graphqlErrors(errors: GraphQLError[]): void {
    this.flush({
      errors,
    });
  }
}
