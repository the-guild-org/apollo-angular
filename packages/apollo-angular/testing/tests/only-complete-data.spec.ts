import { Apollo, gql, onlyCompleteData, onlyCompleteFragment, provideApollo } from 'apollo-angular';
import { map, Subject } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { InMemoryCache, NetworkStatus, type ObservableQuery } from '@apollo/client/core';
import { MockLink } from '@apollo/client/testing';

interface Result {
  user: {
    name: string;
  };
}

const query = gql<Result, Record<string, never>>`
  query User {
    user {
      name
    }
  }
`;

const fragment = gql<Result, Record<string, never>>`
  fragment UserFragment on User {
    user {
      name
    }
  }
`;

describe('onlyCompleteData', () => {
  let theUser: Result['user'] | null = null;
  let count = 0;

  test('should receive only complete results', () =>
    new Promise<void>(done => {
      const b = new Subject<ObservableQuery.Result<Result>>();
      b.pipe(onlyCompleteData()).subscribe({
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

  test('should compile', () => {
    TestBed.configureTestingModule({
      providers: [
        provideApollo(() => {
          return {
            link: new MockLink([]),
            cache: new InMemoryCache(),
          };
        }),
      ],
    });

    const apollo = TestBed.inject(Apollo);

    apollo
      .watchQuery({
        query: query,
      })
      .valueChanges.pipe(
        onlyCompleteData(),
        map(result => result.data.user.name),
      );

    apollo
      .watchFragment({
        fragment: fragment,
        from: {
          __typename: 'User',
          id: 1,
        },
      })
      .pipe(
        onlyCompleteFragment(),
        map(result => result.data.user.name),
      );
  });
});
