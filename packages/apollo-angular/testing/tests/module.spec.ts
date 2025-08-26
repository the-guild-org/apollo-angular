import { describe, expect, test } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { gql, InMemoryCache } from '@apollo/client/core';
import { Apollo } from '../../src';
import { APOLLO_TESTING_CACHE, ApolloTestingController, ApolloTestingModule } from '../src';

describe('ApolloTestingModule', () => {
  test('should provide a default ApolloCache', () => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });

    const apollo = TestBed.inject(Apollo);
    const cache = apollo.client.cache as InMemoryCache;

    expect(cache).toBeInstanceOf(InMemoryCache);
  });

  test('should allow to use custom ApolloCache', () => {
    const cache = new InMemoryCache();

    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: cache,
        },
      ],
    });

    const apollo = TestBed.inject(Apollo);

    expect(apollo.client.cache).toBe(cache);
  });

  test('should not modify test data', () =>
    new Promise<void>(done => {
      TestBed.configureTestingModule({
        imports: [ApolloTestingModule],
      });

      const apollo = TestBed.inject(Apollo);
      const backend = TestBed.inject(ApolloTestingController);

      const testQuery = gql`
        query allHeroes {
          heroes {
            name
          }
        }
      `;

      const testData = [
        {
          id: '1',
          name: 'Spiderman',
        },
        {
          id: '2',
          name: 'Batman',
        },
      ];
      const testGqlData = {
        data: {
          heroes: testData,
        },
      };

      apollo
        .query<any>({
          query: testQuery,
        })
        .subscribe(result => {
          expect(result.data.heroes[0].name).toBe('Spiderman');
          done();
        });

      backend.expectOne('allHeroes').flush(testGqlData);
      expect(testGqlData.data.heroes).toEqual(testData);
    }));
});
