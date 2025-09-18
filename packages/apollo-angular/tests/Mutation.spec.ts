import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Apollo, gql, Mutation } from '../src';

const mutation = gql`
  mutation addHero($name: String) {
    addHero(name: $name) {
      name
    }
  }
`;

@Injectable()
export class AddHeroMutation extends Mutation {
  public document = mutation;
}

describe('Mutation', () => {
  let apolloMock: Apollo & { mutate: Mock };
  let addHero: AddHeroMutation;

  function createApollo() {
    apolloMock = {
      mutate: vi.fn(),
      use(name: string) {
        if (name === 'default') {
          return apolloMock;
        }
      },
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
        AddHeroMutation,
      ],
    });

    addHero = TestBed.inject(AddHeroMutation);
  });

  test('should have document defined', () => {
    expect(addHero.document).toEqual(mutation);
  });

  test('should use watchQuery under the hood', () => {
    apolloMock.mutate.mockReturnValue('FetchResult');

    const result = addHero.mutate();

    expect(apolloMock.mutate).toBeCalled();
    expect(result).toEqual('FetchResult');
  });

  test('should pass variables to Apollo.mutate', () => {
    addHero.mutate({ variables: { foo: 1 } });

    expect(apolloMock.mutate).toBeCalled();
    expect(apolloMock.mutate.mock.calls[0][0]).toMatchObject({
      variables: { foo: 1 },
    });
  });

  test('should pass options to Apollo.mutate', () => {
    addHero.mutate({ fetchPolicy: 'no-cache' });

    expect(apolloMock.mutate).toBeCalled();
    expect(apolloMock.mutate.mock.calls[0][0]).toMatchObject({
      fetchPolicy: 'no-cache',
    });
  });

  test('should not overwrite query when options object is provided', () => {
    addHero.mutate({ mutation: 'asd', fetchPolicy: 'cache-first' } as any);

    expect(apolloMock.mutate).toBeCalled();
    expect(apolloMock.mutate.mock.calls[0][0]).toMatchObject({
      mutation,
      fetchPolicy: 'cache-first',
    });
  });
});
