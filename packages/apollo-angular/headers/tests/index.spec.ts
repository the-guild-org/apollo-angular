import { of } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { HttpHeaders } from '@angular/common/http';
import { ApolloLink, execute, gql } from '@apollo/client/core';
import { httpHeaders } from '../src';

const query = gql`
  query heroes {
    heroes {
      name
      __typename
    }
  }
`;
const data = { heroes: [{ name: 'Foo', __typename: 'Hero' }] };

describe('httpHeaders', () => {
  test('should turn object into HttpHeaders', () =>
    new Promise<void>(done => {
      const headersLink = httpHeaders();

      const mockLink = new ApolloLink(operation => {
        const { headers } = operation.getContext();

        expect(headers instanceof HttpHeaders).toBe(true);
        expect(headers.get('Authorization')).toBe('Bearer Foo');

        return of({ data });
      });

      const link = headersLink.concat(mockLink);

      execute(link, {
        query,
        context: {
          headers: {
            Authorization: 'Bearer Foo',
          },
        },
      }).subscribe(result => {
        expect(result.data).toEqual(data);
        done();
      });
    }));

  test('should not set headers when not defined', () =>
    new Promise<void>(done => {
      const headersLink = httpHeaders();

      const mockLink = new ApolloLink(operation => {
        const { headers } = operation.getContext();

        expect(headers).toBeUndefined();

        return of({ data });
      });

      const link = headersLink.concat(mockLink);

      execute(link, {
        query,
      }).subscribe(result => {
        expect(result.data).toEqual(data);
        done();
      });
    }));
});
