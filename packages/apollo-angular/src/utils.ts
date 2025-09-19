import { Observable, queueScheduler, SchedulerAction, SchedulerLike, Subscription } from 'rxjs';
import { map, observeOn, startWith } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import type { ApolloClient } from "@apollo/client";
import { Apollo } from './apollo';

/**
 * Like RxJS's `fromPromise()`, but starts the promise only when the observable is subscribed to.
 */
export function fromLazyPromise<T>(promiseFn: () => Promise<T>): Observable<T> {
  return new Observable<T>(subscriber => {
    promiseFn().then(
      result => {
        if (!subscriber.closed) {
          subscriber.next(result);
          subscriber.complete();
        }
      },
      error => {
        if (!subscriber.closed) {
          subscriber.error(error);
        }
      },
    );

    return () => subscriber.unsubscribe();
  });
}

export function useMutationLoading<T>(
  source: Observable<ApolloClient.MutateResult<T>>,
  enabled: boolean,
) {
  if (!enabled) {
    return source.pipe(
      map<ApolloClient.MutateResult<T>, Apollo.MutateResult<T>>(result => ({
        ...result,
        loading: false,
      })),
    );
  }

  return source.pipe(
    map<ApolloClient.MutateResult<T>, Apollo.MutateResult<T>>(result => ({
      ...result,
      loading: false,
    })),
    startWith<Apollo.MutateResult<T>>({
      data: undefined,
      loading: true,
    }),
  );
}

export class ZoneScheduler implements SchedulerLike {
  constructor(private readonly zone: NgZone) {}

  public readonly now = Date.now;

  public schedule<T>(
    work: (this: SchedulerAction<T>, state?: T) => void,
    delay: number = 0,
    state?: T,
  ): Subscription {
    return this.zone.run(() => queueScheduler.schedule(work, delay, state)) as Subscription;
  }
}

export function wrapWithZone<T>(obs: Observable<T>, ngZone: NgZone): Observable<T> {
  return obs.pipe(observeOn(new ZoneScheduler(ngZone)));
}
