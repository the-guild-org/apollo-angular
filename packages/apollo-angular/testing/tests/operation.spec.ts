import { beforeEach, describe, expect, test } from 'vitest';
import { ApolloLink, execute, gql } from "@apollo/client";
import { ApolloTestingBackend } from '../src/backend';
import { buildOperationForLink } from './utils';

const testQuery = gql`
  query allHeroes {
    heroes {
      name
    }
  }
`;
const testSubscription = gql`
  subscription newHeroes {
    heroes {
      name
    }
  }
`;
const testMutation = gql`
  mutation addHero($hero: String!) {
    addHero(hero: $hero) {
      name
    }
  }
`;

describe('TestOperation', () => {
  let mock: ApolloTestingBackend;
  let link: ApolloLink;

  beforeEach(() => {
    mock = new ApolloTestingBackend();
    link = new ApolloLink(op =>
      mock.handle({
        ...op,
        clientName: 'default',
      }),
    );
  });

  test('accepts a null body', () =>
    new Promise<void>(done => {
      const operation = buildOperationForLink(testQuery, {});

      execute(link, operation).subscribe(result => {
        expect(result).toBeNull();
        done();
      });

      mock.expectOne(testQuery).flush(null!);
    }));

  test('should accepts data for flush operation', () =>
    new Promise<void>(done => {
      const operation = buildOperationForLink(testQuery, {});

      execute(link, operation).subscribe(result => {
        expect(result).toEqual({
          data: {
            heroes: [],
          },
        });

        done();
      });

      mock.expectOne(testQuery).flushData({
        heroes: [],
      });
    }));

  test('should leave the operation open for a subscription', () =>
    new Promise<void>(done => {
      const operation = buildOperationForLink(testSubscription, {});
      const emittedResults: ApolloLink.Result[] = [];

      execute(link, operation).subscribe({
        next(result) {
          emittedResults.push(result);
        },
        complete() {
          expect(emittedResults).toEqual([
            {
              data: {
                heroes: ['first Hero'],
              },
            },
            {
              data: {
                heroes: ['second Hero'],
              },
            },
          ]);
          done();
        },
      });

      const testOperation = mock.expectOne(testSubscription);

      testOperation.flushData({
        heroes: ['first Hero'],
      });

      testOperation.flushData({
        heroes: ['second Hero'],
      });

      testOperation.complete();
    }));

  test('should close the operation after a query', () =>
    new Promise<void>(done => {
      const operation = buildOperationForLink(testQuery, {});
      const emittedResults: ApolloLink.Result[] = [];

      execute(link, operation).subscribe({
        next(result) {
          emittedResults.push(result);
        },
        complete() {
          expect(emittedResults).toEqual([
            {
              data: {
                heroes: ['first Hero'],
              },
            },
          ]);
          done();
        },
      });

      const testOperation = mock.expectOne(testQuery);

      testOperation.flushData({
        heroes: ['first Hero'],
      });

      testOperation.flushData({
        heroes: ['second Hero'],
      });
    }));

  test('should close the operation after a mutation', () =>
    new Promise<void>(done => {
      const operation = buildOperationForLink(testMutation, { hero: 'firstHero' });
      const emittedResults: ApolloLink.Result[] = [];

      execute(link, operation).subscribe({
        next(result) {
          emittedResults.push(result);
        },
        complete() {
          expect(emittedResults).toEqual([
            {
              data: {
                heroes: ['first Hero'],
              },
            },
          ]);
          done();
        },
      });

      const testOperation = mock.expectOne(testMutation);

      testOperation.flushData({
        heroes: ['first Hero'],
      });

      testOperation.flushData({
        heroes: ['second Hero'],
      });
    }));
});
