import type { OperationVariables } from '@apollo/client';
import type { Apollo } from './apollo';
import type { EmptyObject } from './types';

/** @deprecated Use `Apollo.WatchQueryOptions` instead */
export type WatchQueryOptions<
  TVariables extends OperationVariables = EmptyObject,
  TData = unknown,
> = Apollo.WatchQueryOptions<TData, TVariables>;

/** @deprecated Use `Apollo.MutateOptions` instead */
export type MutationOptions<
  TData = unknown,
  TVariables extends OperationVariables = EmptyObject,
> = Apollo.MutateOptions<TData, TVariables>;

/** @deprecated Use `Apollo.MutateResult` instead */
export type MutationResult<TData = unknown> = Apollo.MutateResult<TData>;
