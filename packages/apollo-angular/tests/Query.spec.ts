import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Apollo, gql, Query } from '../src';

const query = gql`
  query heroes {
    allHeroes {
      name
    }
  }
`;

@Injectable()
export class HeroesQuery extends Query {
  public document = query;
}

@Injectable()
export class HeroesNamedQuery extends Query {
  public document = query;
  client = 'custom';
}

describe('Query', () => {
  let apolloMock: Apollo & {
    watchQuery: Mock;
    query: Mock;
    use: (name: string) => Apollo;
  };
  let apolloCustomMock: Apollo & { watchQuery: Mock; query: Mock };
  let heroesQuery: HeroesQuery;
  let heroesNamedQuery: HeroesNamedQuery;

  function createApollo() {
    apolloCustomMock = {
      watchQuery: vi.fn(),
      query: vi.fn(),
    } as any;

    apolloMock = {
      watchQuery: vi.fn(),
      query: vi.fn(),
      use: vi.fn((name: string) => {
        if (name === 'default') {
          return apolloMock;
        }

        return apolloCustomMock;
      }),
    } as any;

    return apolloMock;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Apollo,
          useFactory: createApollo,
        },
        HeroesQuery,
        HeroesNamedQuery,
      ],
    });

    heroesQuery = TestBed.inject(HeroesQuery);
    heroesNamedQuery = TestBed.inject(HeroesNamedQuery);
  });

  test('should have document defined', () => {
    expect(heroesQuery.document).toEqual(query);
  });

  describe('watch()', () => {
    test('should use watchQuery under the hood', () => {
      apolloMock.watchQuery.mockReturnValue('QueryRef');

      const result = heroesQuery.watch();

      expect(apolloMock.watchQuery).toBeCalled();
      expect(result).toEqual('QueryRef');
    });

    test('should pass variables to Apollo.watchQuery', () => {
      heroesQuery.watch({ variables: { foo: 1 } });

      expect(apolloMock.watchQuery).toBeCalled();
      expect(apolloMock.watchQuery.mock.calls[0][0]).toMatchObject({
        variables: { foo: 1 },
      });
    });

    test('should pass options to Apollo.watchQuery', () => {
      heroesQuery.watch({ fetchPolicy: 'network-only' });

      expect(apolloMock.watchQuery).toBeCalled();
      expect(apolloMock.watchQuery.mock.calls[0][0]).toMatchObject({
        fetchPolicy: 'network-only',
      });
    });

    test('should not overwrite query when options object is provided', () => {
      heroesQuery.watch({ query: 'asd', fetchPolicy: 'cache-first' } as any);

      expect(apolloMock.watchQuery).toBeCalled();
      expect(apolloMock.watchQuery.mock.calls[0][0]).toMatchObject({
        query,
        fetchPolicy: 'cache-first',
      });
    });

    test('should handle named clients', () => {
      apolloCustomMock.watchQuery.mockReturnValue('QueryRef');

      const result = heroesNamedQuery.watch();

      expect(apolloMock.use).toBeCalledWith(heroesNamedQuery.client);
      expect(apolloCustomMock.watchQuery).toBeCalled();
      expect(result).toEqual('QueryRef');
    });
  });

  describe('fetch()', () => {
    test('should use query under the hood', () => {
      apolloMock.query.mockReturnValue('Result');

      const result = heroesQuery.fetch();

      expect(apolloMock.query).toBeCalled();
      expect(result).toEqual('Result');
    });

    test('should pass variables to Apollo.query', () => {
      heroesQuery.fetch({ variables: { foo: 1 } });

      expect(apolloMock.query).toBeCalled();
      expect(apolloMock.query.mock.calls[0][0]).toMatchObject({
        variables: { foo: 1 },
      });
    });

    test('should pass options to Apollo.query', () => {
      heroesQuery.fetch({ fetchPolicy: 'network-only' });

      expect(apolloMock.query).toBeCalled();
      expect(apolloMock.query.mock.calls[0][0]).toMatchObject({
        fetchPolicy: 'network-only',
      });
    });

    test('should not overwrite query when options object is provided', () => {
      heroesQuery.fetch({ query: 'asd', fetchPolicy: 'cache-first' } as any);

      expect(apolloMock.query).toBeCalled();
      expect(apolloMock.query.mock.calls[0][0]).toMatchObject({
        query,
        fetchPolicy: 'cache-first',
      });
    });

    test('should handle named clients', () => {
      apolloCustomMock.query.mockReturnValue('Observable');

      const result = heroesNamedQuery.fetch();

      expect(apolloMock.use).toBeCalledWith(heroesNamedQuery.client);
      expect(apolloCustomMock.query).toBeCalled();
      expect(result).toEqual('Observable');
    });
  });
});
