import { from, Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import type {
  ApolloClient,
  MaybeMasked,
  ObservableQuery,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client/core';
import { EmptyObject } from './types';
import { wrapWithZone } from './utils';

export type QueryRefFromDocument<T extends TypedDocumentNode> =
  T extends TypedDocumentNode<infer TData, infer TVariables>
    ? QueryRef<TData, TVariables & OperationVariables>
    : never;

export class QueryRef<TData, TVariables extends OperationVariables = EmptyObject> {
  public readonly valueChanges: Observable<ObservableQuery.Result<TData>>;

  constructor(
    private readonly obsQuery: ObservableQuery<TData, TVariables>,
    ngZone: NgZone,
  ) {
    this.valueChanges = wrapWithZone(from(this.obsQuery), ngZone);
  }

  // ObservableQuery's methods

  public get options(): ObservableQuery<TData, TVariables>['options'] {
    return this.obsQuery.options;
  }

  public get variables(): ObservableQuery<TData, TVariables>['variables'] {
    return this.obsQuery.variables;
  }

  public getCurrentResult(): ReturnType<ObservableQuery<TData, TVariables>['getCurrentResult']> {
    return this.obsQuery.getCurrentResult();
  }

  public refetch(
    variables?: Parameters<ObservableQuery<TData, TVariables>['refetch']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['refetch']> {
    return this.obsQuery.refetch(variables);
  }

  public fetchMore<TFetchData = TData, TFetchVars extends OperationVariables = TVariables>(
    fetchMoreOptions: ObservableQuery.FetchMoreOptions<TData, TVariables, TFetchData, TFetchVars>,
  ): Promise<ApolloClient.QueryResult<MaybeMasked<TFetchData>>> {
    return this.obsQuery.fetchMore(fetchMoreOptions);
  }

  public subscribeToMore<
    TSubscriptionData = TData,
    TSubscriptionVariables extends OperationVariables = TVariables,
  >(
    options: ObservableQuery.SubscribeToMoreOptions<
      TData,
      TSubscriptionVariables,
      TSubscriptionData,
      TVariables
    >,
  ): ReturnType<ObservableQuery<TData, TVariables>['subscribeToMore']> {
    return this.obsQuery.subscribeToMore(options);
  }

  public updateQuery(
    mapFn: Parameters<ObservableQuery<TData, TVariables>['updateQuery']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['updateQuery']> {
    return this.obsQuery.updateQuery(mapFn);
  }

  public stopPolling(): ReturnType<ObservableQuery<TData, TVariables>['stopPolling']> {
    return this.obsQuery.stopPolling();
  }

  public startPolling(
    pollInterval: Parameters<ObservableQuery<TData, TVariables>['startPolling']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['startPolling']> {
    return this.obsQuery.startPolling(pollInterval);
  }

  public setVariables(
    variables: Parameters<ObservableQuery<TData, TVariables>['setVariables']>[0],
  ): ReturnType<ObservableQuery<TData, TVariables>['setVariables']> {
    return this.obsQuery.setVariables(variables);
  }

  public reobserve(
    options: ObservableQuery.Options<TData, TVariables>,
  ): ReturnType<ObservableQuery<TData, TVariables>['reobserve']> {
    return this.obsQuery.reobserve(options);
  }
}
