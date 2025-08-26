import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NgZone } from '@angular/core';
import { ApolloClient, ApolloLink, InMemoryCache, ObservableQuery } from '@apollo/client/core';
import { mockSingleLink } from '@apollo/client/testing';
import { gql } from '../src/gql';
import { QueryRef } from '../src/query-ref';

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
  operationName: 'allHeroes',
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
  let client: ApolloClient<any>;
  let obsQuery: ObservableQuery<any>;
  let queryRef: QueryRef<any>;

  beforeEach(() => {
    ngZone = { run: vi.fn(cb => cb()) } as any;
    const mockedLink = mockSingleLink(
      {
        request: heroesOperation,
        result: { data: { heroes: [Superman] } },
      },
      {
        request: heroesOperation,
        result: { data: { heroes: [Superman, Batman] } },
      },
    );

    client = createClient(mockedLink);
    obsQuery = client.watchQuery(heroesOperation);
    queryRef = new QueryRef<any>(obsQuery, ngZone);
  });

  test('should listen to changes', () =>
    new Promise<void>(done => {
      queryRef.valueChanges.subscribe({
        next: result => {
          expect(result.data).toBeDefined();
          done();
        },
        error: e => {
          throw e;
        },
      });
    }));

  test('should be able to call refetch', () => {
    const mockCallback = vi.fn();
    obsQuery.refetch = mockCallback;

    queryRef.refetch();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able refetch and receive new results', () =>
    new Promise<void>(done => {
      let calls = 0;

      queryRef.valueChanges.subscribe({
        next: result => {
          calls++;

          expect(result.data).toBeDefined();

          if (calls === 2) {
            done();
          }
        },
        error: e => {
          throw e;
        },
        complete: () => {
          throw 'Should not be here';
        },
      });

      setTimeout(() => {
        queryRef.refetch();
      }, 200);
    }));

  test('should be able refetch and receive new results after using rxjs operator', () =>
    new Promise<void>(done => {
      let calls = 0;
      const obs = queryRef.valueChanges;

      obs.pipe(map(result => result.data)).subscribe({
        next: result => {
          calls++;

          if (calls === 1) {
            expect(result.heroes.length).toBe(1);
          } else if (calls === 2) {
            expect(result.heroes.length).toBe(2);

            done();
          }
        },
        error: e => {
          throw e;
        },
        complete: () => {
          throw 'Should not be here';
        },
      });

      setTimeout(() => {
        queryRef.refetch();
      }, 200);
    }));

  test('should be able to call updateQuery()', () => {
    const mockCallback = vi.fn();
    const mapFn = () => ({});
    obsQuery.updateQuery = mockCallback;

    queryRef.updateQuery(mapFn);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(mapFn);
  });

  test('should be able to call result()', () => {
    const mockCallback = vi.fn();
    obsQuery.result = mockCallback.mockReturnValue('expected');

    const result = queryRef.result();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call getCurrentResult() and get updated results', () =>
    new Promise<void>(done => {
      let calls = 0;
      const obs = queryRef.valueChanges;

      obs.pipe(map(result => result.data)).subscribe({
        next: result => {
          calls++;
          const currentResult = queryRef.getCurrentResult();
          expect(currentResult.data.heroes.length).toBe(result.heroes.length);

          if (calls === 2) {
            done();
          }
        },
        error: e => {
          throw e;
        },
        complete: () => {
          throw 'Should not be here';
        },
      });

      setTimeout(() => {
        queryRef.refetch();
      }, 200);
    }));

  test('should be able to call getLastResult()', () => {
    const mockCallback = vi.fn();
    obsQuery.getLastResult = mockCallback.mockReturnValue('expected');

    const result = queryRef.getLastResult();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call getLastError()', () => {
    const mockCallback = vi.fn();
    obsQuery.getLastError = mockCallback.mockReturnValue('expected');

    const result = queryRef.getLastError();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  test('should be able to call resetLastResults()', () => {
    const mockCallback = vi.fn();
    obsQuery.resetLastResults = mockCallback.mockReturnValue('expected');

    const result = queryRef.resetLastResults();

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
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

  test('should be able to call setOptions()', () => {
    const mockCallback = vi.fn();
    const opts = {};
    obsQuery.setOptions = mockCallback.mockReturnValue('expected');

    const result = queryRef.setOptions(opts);

    expect(result).toBe('expected');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(opts);
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

          expect(result.data).toBeDefined();
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

          expect(result.data).toBeDefined();

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
      const id = queryRef.queryId;

      const sub = obs.subscribe(() => {
        //
      });

      expect(client['queryManager'].queries.get(id)).toBeDefined();

      setTimeout(() => {
        sub.unsubscribe();
        expect(client['queryManager'].queries.get(id)).toBeUndefined();
        done();
      });
    }));

  test('should unsubscribe based on rxjs operators', () =>
    new Promise<void>(done => {
      const gate = new Subject<void>();
      const obs = queryRef.valueChanges.pipe(takeUntil(gate));
      const id = queryRef.queryId;

      obs.subscribe(() => {
        //
      });

      expect(client['queryManager'].queries.get(id)).toBeDefined();

      gate.next();

      expect(client['queryManager'].queries.get(id)).toBeUndefined();
      done();
    }));
});
