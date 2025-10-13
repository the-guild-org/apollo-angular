import { onlyComplete } from 'apollo-angular';
import { Subject } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { NetworkStatus, ObservableQuery } from '@apollo/client/core';

interface Result {
  user: {
    name: string;
  };
}

describe('onlyComplete', () => {
  let theUser: Result['user'] | null = null;
  let count = 0;

  test('should receive only complete results', () =>
    new Promise<void>(done => {
      const b = new Subject<ObservableQuery.Result<Result>>();
      b.pipe(onlyComplete()).subscribe({
        next: result => {
          count++;
          theUser = result.data.user;
        },
        complete: () => {
          expect(count).toBe(1);
          expect(theUser).toEqual({ name: 'foo' });
          done();
        },
      });

      b.next({
        dataState: 'partial',
        data: {},
        loading: true,
        partial: true,
        networkStatus: NetworkStatus.loading,
      } satisfies ObservableQuery.Result<Result, 'partial'>);

      b.next({
        dataState: 'complete',
        data: { user: { name: 'foo' } },
        loading: false,
        partial: false,
        networkStatus: NetworkStatus.ready,
      } satisfies ObservableQuery.Result<Result, 'complete'>);

      b.next({
        dataState: 'partial',
        data: {},
        loading: true,
        partial: true,
        networkStatus: NetworkStatus.loading,
      } satisfies ObservableQuery.Result<Result, 'partial'>);

      b.complete();
    }));
});
