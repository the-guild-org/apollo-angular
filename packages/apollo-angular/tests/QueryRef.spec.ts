import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NgZone } from '@angular/core';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NetworkStatus,
  ObservableQuery,
} from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { gql } from '../src/gql';
import { QueryRef } from '../src/query-ref';
import { ObservableStream } from '../test-utils/ObservableStream';

const createClient = (link: ApolloLink) =>
  new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

const heroesOperation = {
  query: gql`
    query allHeroes {
      heroes {
        name
        __typename
      }
    }
  `,
  variables: {},
};

// tslint:disable:variable-name
const __typename = 'Hero';

const Superman = {
  name: 'Superman',
  __typename,
};
const Batman = {
  name: 'Batman',
  __typename,
};

describe('QueryRef', () => {
  let ngZone: NgZone;
  let client: ApolloClient;
  let obsQuery: ObservableQuery<any>;
  let queryRef: QueryRef<any>;

  beforeEach(() => {
    ngZone = { run: vi.fn(cb => cb()) } as any;
    const mockedLink = new MockLink([
      {
        request: heroesOperation,
        result: { data: { heroes: [Superman] } },
      },
      {
        request: heroesOperation,
        result: { data: { heroes: [Superman, Batman] } },
      },
    ]);

    client = createClient(mockedLink);
    obsQuery = client.watchQuery(heroesOperation);
    queryRef = new QueryRef<any>(obsQuery, ngZone);
  });

  test('should listen to changes', async () => {
    const stream = new ObservableStream(queryRef.valueChanges);

    await expect(stream.takeNext()).resolves.toMatchObject({ loading: true });

    const result = await stream.takeNext();
    expect(result.data).toBeDefined();
  });

  test('should be able to call refetch', () => {
    const mockCallback = vi.fn();
    obsQuery.refetch = mockCallback;

    queryRef.refetch();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able refetch and receive new results', async () => {
    const stream = new ObservableStream(queryRef.valueChanges);

    await expect(stream.takeNext()).resolves.toEqual({
      data: undefined,
      dataState: 'empty',
      loading: true,
      networkStatus: NetworkStatus.loading,
      partial: true,
    });

    await expect(stream.takeNext()).resolves.toEqual({
      data: { heroes: [Superman] },
      dataState: 'complete',
      loading: false,
      networkStatus: NetworkStatus.ready,
      partial: false,
    });

    queryRef.refetch();

    await expect(stream.takeNext()).resolves.toEqual({
      data: { heroes: [Superman] },
      dataState: 'complete',
      loading: true,
      networkStatus: NetworkStatus.refetch,
      partial: false,
    });

    await expect(stream.takeNext()).resolves.toEqual({
      data: { heroes: [Superman, Batman] },
      dataState: 'complete',
      loading: false,
      networkStatus: NetworkStatus.ready,
      partial: false,
    });

    await expect(stream).not.toEmitAnything();
  });

  test('should be able refetch and receive new results after using rxjs operator', async () => {
    const obs = queryRef.valueChanges.pipe(map(result => result.data));
    const stream = new ObservableStream(obs);

    await expect(stream.takeNext()).resolves.toBeUndefined();
    await expect(stream.takeNext()).resolves.toEqual({ heroes: [Superman] });

    queryRef.refetch();

    await expect(stream.takeNext()).resolves.toEqual({ heroes: [Superman] });
    await expect(stream.takeNext()).resolves.toEqual({ heroes: [Superman, Batman] });
    await expect(stream).not.toEmitAnything();
  });

  test('should be able to call updateQuery()', () => {
    const mockCallback = vi.fn();
    const mapFn = () => ({});
    obsQuery.updateQuery = mockCallback;

    queryRef.updateQuery(mapFn);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(mapFn);
  });

  test('should be able to call getCurrentResult() and get updated results', async () => {
    const stream = new ObservableStream(queryRef.valueChanges);

    {
      const result = await stream.takeNext();
      const currentResult = queryRef.getCurrentResult();

      expect(currentResult).toEqual(result);
      expect(currentResult).toEqual({
        data: undefined,
        dataState: 'empty',
        loading: true,
        networkStatus: NetworkStatus.loading,
        partial: true,
      });
    }

    {
      const result = await stream.takeNext();
      const currentResult = queryRef.getCurrentResult();

      expect(currentResult).toEqual(result);
      expect(currentResult).toEqual({
        data: { heroes: [Superman] },
        dataState: 'complete',
        loading: false,
        networkStatus: NetworkStatus.ready,
        partial: false,
      });
    }

    queryRef.refetch();

    {
      const result = await stream.takeNext();
      const currentResult = queryRef.getCurrentResult();

      expect(currentResult).toEqual(result);
      expect(currentResult).toEqual({
        data: { heroes: [Superman] },
        dataState: 'complete',
        loading: true,
        networkStatus: NetworkStatus.refetch,
        partial: false,
      });
    }

    {
      const result = await stream.takeNext();
      const currentResult = queryRef.getCurrentResult();

      expect(currentResult).toEqual(result);
      expect(currentResult).toEqual({
        data: { heroes: [Superman, Batman] },
        dataState: 'complete',
        loading: false,
        networkStatus: NetworkStatus.ready,
        partial: false,
      });
    }

    await expect(stream).not.toEmitAnything();
  });

  test('should be able to call fetchMore()', () => {
    const mockCallback = vi.fn();
    const opts = { foo: 1 };
    obsQuery.fetchMore = mockCallback.mockReturnValue('expected');

    const result = queryRef.fetchMore(opts as any);

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(opts);
  });

  test('should be able to call subscribeToMore()', () => {
    const mockCallback = vi.fn();
    const opts = { foo: 1 };
    obsQuery.subscribeToMore = mockCallback;

    queryRef.subscribeToMore(opts as any);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(opts);
  });

  test('should be able to call stopPolling()', () => {
    const mockCallback = vi.fn();
    obsQuery.stopPolling = mockCallback;

    queryRef.stopPolling();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call startPolling()', () => {
    const mockCallback = vi.fn();
    obsQuery.startPolling = mockCallback;

    queryRef.startPolling(3000);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(3000);
  });

  test('should be able to call setVariables()', () => {
    const mockCallback = vi.fn();
    const variables = {};
    obsQuery.setVariables = mockCallback.mockReturnValue('expected');

    const result = queryRef.setVariables(variables);

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(variables);
  });

  test('should handle multiple subscribers', () =>
    new Promise<void>(done => {
      const obsFirst = queryRef.valueChanges;
      const obsSecond = queryRef.valueChanges;

      let calls = {
        first: 0,
        second: 0,
      };

      const subFirst = obsFirst.subscribe({
        next: result => {
          calls.first++;

          // Initial loading state
          expect(result.data).not.toBeDefined();
        },
        error: e => {
          throw e;
        },
        complete: () => {
          throw 'Should not be here';
        },
      });

      const subSecond = obsSecond.subscribe({
        next: result => {
          calls.second++;

          // Initial loading state
          expect(result.data).not.toBeDefined();

          setTimeout(() => {
            subSecond.unsubscribe();
            // tslint:disable:no-use-before-declare
            check();
          });
        },
        error: e => {
          throw e;
        },
        complete: () => {
          if (calls.second !== 1) {
            throw 'Should be called only after first call';
          }
        },
      });

      const check = () => {
        expect(calls.first).toBe(1);
        expect(calls.second).toBe(1);

        expect(subFirst.closed).toBe(false);
        expect(subSecond.closed).toBe(true);

        done();
      };
    }));

  test('should unsubscribe', () =>
    new Promise<void>(done => {
      const obs = queryRef.valueChanges;

      const sub = obs.subscribe(() => {
        //
      });

      expect(client.getObservableQueries().size).toBe(1);

      setTimeout(() => {
        sub.unsubscribe();
        expect(client.getObservableQueries().size).toBe(0);
        done();
      });
    }));

  test('should unsubscribe based on rxjs operators', () =>
    new Promise<void>(done => {
      const gate = new Subject<void>();
      const obs = queryRef.valueChanges.pipe(takeUntil(gate));

      obs.subscribe(() => {
        //
      });

      expect(client.getObservableQueries().size).toBe(1);

      gate.next();

      expect(client.getObservableQueries().size).toBe(0);
      done();
    }));
});
