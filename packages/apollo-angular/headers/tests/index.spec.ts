import { of } from 'rxjs';
import { describe, expect, test } from 'vitest';
import { HttpHeaders } from '@angular/common/http';
import { ApolloClient, ApolloLink, execute, gql, InMemoryCache } from "@apollo/client";
import { HttpHeadersLink } from '../src';

const query = gql`
  query heroes {
    heroes {
      name
      __typename
    }
  }
`;
const data = { heroes: [{ name: 'Foo', __typename: 'Hero' }] };

const dummyClient = new ApolloClient({ cache: new InMemoryCache(), link: ApolloLink.empty() });

describe('httpHeaders', () => {
  test('should turn object into HttpHeaders', () =>
    new Promise<void>(done => {
      const headersLink = new HttpHeadersLink();

      const mockLink = new ApolloLink(operation => {
        const { headers } = operation.getContext();

        expect(headers instanceof HttpHeaders).toBe(true);
        expect(headers.get('Authorization')).toBe('Bearer Foo');

        return of({ data });
      });

      const link = headersLink.concat(mockLink);

      execute(
        link,
        {
          query,
          context: {
            headers: {
              Authorization: 'Bearer Foo',
            },
          },
        },
        { client: dummyClient },
      ).subscribe(result => {
        expect(result.data).toEqual(data);
        done();
      });
    }));

  test('should not set headers when not defined', () =>
    new Promise<void>(done => {
      const headersLink = new HttpHeadersLink();

      const mockLink = new ApolloLink(operation => {
        const { headers } = operation.getContext();

        expect(headers).toBeUndefined();

        return of({ data });
      });

      const link = headersLink.concat(mockLink);

      execute(link, { query }, { client: dummyClient }).subscribe(result => {
        expect(result.data).toEqual(data);
        done();
      });
    }));
});
