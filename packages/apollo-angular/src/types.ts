import type {
  ApolloClientOptions,
  MutationOptions as CoreMutationOptions,
  QueryOptions as CoreQueryOptions,
  SubscriptionOptions as CoreSubscriptionOptions,
  WatchFragmentOptions as CoreWatchFragmentOptions,
  WatchQueryOptions as CoreWatchQueryOptions,
  FetchResult,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client/core';

export type EmptyObject = {
  [key: string]: any;
};

export type ResultOf<T extends TypedDocumentNode> =
  T extends TypedDocumentNode<infer R> ? R : never;
export type VariablesOf<T extends TypedDocumentNode> =
  T extends TypedDocumentNode<any, infer V> ? V : never;

export interface ExtraSubscriptionOptions {
  useZone?: boolean;
}

export type MutationResult<TData = any> = FetchResult<TData> & {
  loading?: boolean;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface WatchQueryOptionsAlone<
  TVariables extends OperationVariables = EmptyObject,
  TData = any,
> extends Omit<WatchQueryOptions<TVariables, TData>, 'query' | 'variables'> {}

export interface QueryOptionsAlone<TVariables = EmptyObject, TData = any>
  extends Omit<CoreQueryOptions<TVariables, TData>, 'query' | 'variables'> {}

export interface MutationOptionsAlone<TData = EmptyObject, TVariables = any>
  extends Omit<MutationOptions<TData, TVariables>, 'mutation' | 'variables'> {}

export interface SubscriptionOptionsAlone<TVariables = EmptyObject, TData = any>
  extends Omit<CoreSubscriptionOptions<TVariables, TData>, 'query' | 'variables'> {}

export interface WatchQueryOptions<TVariables extends OperationVariables = EmptyObject, TData = any>
  extends CoreWatchQueryOptions<TVariables, TData> {}

export interface MutationOptions<TData = any, TVariables = EmptyObject>
  extends CoreMutationOptions<TData, TVariables> {
  /**
   * Observable starts with `{ loading: true }`.
   * There's a big chance the next major version will enable that by default.
   *
   * Disabled by default
   */
  useMutationLoading?: boolean;
}

export interface WatchFragmentOptions<TData = any, TVariables = EmptyObject>
  extends CoreWatchFragmentOptions<TData, TVariables> {}

export type NamedOptions = Record<string, ApolloClientOptions<any>>;

export type Flags = {
  /**
   * Observable starts with `{ loading: true }`.
   *
   * Disabled by default
   */
  useMutationLoading?: boolean;
};
