import type { ApolloClient, ApolloLink, TypedDocumentNode } from '@apollo/client/core';

export type EmptyObject = {
  [key: string]: any;
};

export type ResultOf<T extends TypedDocumentNode> =
  T extends TypedDocumentNode<infer R> ? R : never;
export type VariablesOf<T extends TypedDocumentNode> =
  T extends TypedDocumentNode<any, infer V> ? V : never;

export type MutationResult<TData = unknown> = ApolloLink.Result<TData> & {
  loading?: boolean;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type NamedOptions = Record<string, ApolloClient.Options>;

export type Flags = {
  /**
   * Observable starts with `{ loading: true }`.
   *
   * Disabled by default
   */
  useMutationLoading?: boolean;
};
