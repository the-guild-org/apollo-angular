import type {
  ApolloCache,
  ApolloClient,
  ApolloLink,
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

export type MutationResult<TData = unknown> = ApolloLink.Result<TData> & {
  loading?: boolean;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type SubscriptionOptionsAlone<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> = Omit<ApolloClient.SubscribeOptions<TData, TVariables>, 'query' | 'variables'>;

export type WatchQueryOptions<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> = ApolloClient.WatchQueryOptions<TData, TVariables>;

export type MutationOptions<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> = ApolloClient.MutateOptions<TData, TVariables> & {
  /**
   * Observable starts with `{ loading: true }`.
   * There's a big chance the next major version will enable that by default.
   *
   * Disabled by default
   */
  useMutationLoading?: boolean;
};

export interface WatchFragmentOptions<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> extends ApolloCache.WatchFragmentOptions<TData, TVariables> {}

export type NamedOptions = Record<string, ApolloClient.Options>;

export type Flags = {
  /**
   * Observable starts with `{ loading: true }`.
   *
   * Disabled by default
   */
  useMutationLoading?: boolean;
};
