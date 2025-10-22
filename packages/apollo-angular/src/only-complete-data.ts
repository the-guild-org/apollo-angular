import { filter, type OperatorFunction } from 'rxjs';
import type { ApolloClient, GetDataState, ObservableQuery } from '@apollo/client/core';

type CompleteFragment<TData> = {
  complete: true;
  missing?: never;
} & GetDataState<TData, 'complete'>;

type ForWatchFragment<TData> = OperatorFunction<
  ApolloClient.WatchFragmentResult<TData>,
  CompleteFragment<TData>
>;

/**
 * Filter emitted results to only receive results that are complete (`result.dataState === 'complete'`).
 *
 * This is a small wrapper around rxjs `filter()` for convenience only.
 *
 * If you use this, you should probably combine it with [`notifyOnNetworkStatusChange`](https://www.apollographql.com/docs/react/data/queries#queryhookoptions-interface-notifyonnetworkstatuschange).
 * This tells `@apollo/client` to not emit the first `partial` result, so `apollo-angular` does
 * not need to filter it out. The overall behavior is identical, but it saves some CPU cycles.
 *
 * So something like this:
 *
 * ```ts
 * apollo
 *   .watchQuery({
 *     query: myQuery,
 *     notifyOnNetworkStatusChange: false, // Adding this will save CPU cycles
 *   })
 *   .valueChanges
 *   .pipe(onlyCompleteData())
 *   .subscribe(result => {
 *     // Do something with complete result
 *   });
 * ```
 */
export function onlyCompleteData<TData>(): OperatorFunction<
  ObservableQuery.Result<TData>,
  ObservableQuery.Result<TData, 'complete'>
> {
  return filter(
    (result): result is ObservableQuery.Result<TData, 'complete'> =>
      result.dataState === 'complete',
  );
}

/**
 * @deprecated Use `onlyCompleteData()` instead.
 */
export const onlyComplete = onlyCompleteData;

/**
 * Same as `onlyCompleteData()` but for `Apollo.watchFragment()`.
 */
export function onlyCompleteFragment<TData>(): ForWatchFragment<TData> {
  return filter((result): result is CompleteFragment<TData> => result.dataState === 'complete');
}
