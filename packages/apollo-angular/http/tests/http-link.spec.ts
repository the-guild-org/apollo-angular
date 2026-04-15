import { print, stripIgnoredCharacters } from 'graphql';
import { map, mergeMap } from 'rxjs/operators';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
  provideHttpClient,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApolloLink, gql, InMemoryCache } from '@apollo/client';
import { ServerError } from '@apollo/client/errors';
import { Apollo } from '../../src';
import { HttpLink } from '../src/http-link';
import { executeWithDefaultContext as execute } from './utils';

const noop = () => {
  //
};

describe('HttpLink', () => {
  let httpLink: HttpLink;
  let httpBackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpLink, Apollo],
    });
    httpLink = TestBed.inject(HttpLink);
    httpBackend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  test('should use HttpClient', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };
    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, op).subscribe({
      next: result => expect(result).toEqual({ data }),
      error: () => {
        throw new Error('Should not be here');
      },
    });

    httpBackend.expectOne('graphql').flush({ data });
  });

  test('should handle uri as function', () => {
    const link = httpLink.create({ uri: () => 'custom' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };
    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, op).subscribe({
      next: result => expect(result).toEqual({ data }),
      error: () => {
        throw new Error('Should not be here');
      },
    });

    httpBackend.expectOne('custom').flush({ data });
  });

  test('should use /graphql by default', () => {
    const link = httpLink.create({});
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };
    const data = {
      heroes: [{ name: 'Superman' }],
    };

    execute(link, op).subscribe({
      next: result => expect(result).toEqual({ data }),
      error: () => {
        throw new Error('Should not be here');
      },
    });

    httpBackend.expectOne('graphql').flush({ data });
  });

  test('should send it as JSON with right body and headers', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.operationName).toBe(op.operationName);
      expect(req.reportProgress).toBe(false);
      expect(req.responseType).toBe('json');
      expect(req.detectContentTypeHeader()).toBe('application/json');
      return true;
    });
  });

  test('should use POST by default', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.operationName).toBe(op.operationName);
      expect(req.detectContentTypeHeader()).toBe('application/json');
      return true;
    });
  });

  test('should be able to specify any method', () => {
    const link = httpLink.create({
      uri: 'graphql',
      method: 'GET',
      includeExtensions: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: { up: 'dog' },
      extensions: { what: 'what' },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('GET');
      expect(req.params.get('variables')).toBe(JSON.stringify(op.variables));
      expect(req.params.get('extensions')).toBe(JSON.stringify(op.extensions));
      expect(req.params.get('operationName')).toBe(op.operationName);
      return true;
    });
  });

  test('custom operation printer', () => {
    const link = httpLink.create({
      uri: 'graphql',
      method: 'GET',
      includeQuery: true,
      operationPrinter(doc) {
        return stripIgnoredCharacters(print(doc));
      },
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: { up: 'dog' },
      extensions: { what: 'what' },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('GET');
      expect(req.urlWithParams).not.toEqual(
        'graphql?operationName=heroes&variables=%7B%22up%22:%22dog%22%7D&query=query%20heroes%20%7B%0A%20%20heroes%20%7B%0A%20%20%20%20name%0A%20%20%7D%0A%7D%0A',
      );
      expect(req.urlWithParams).toEqual(
        'graphql?operationName=heroes&variables=%7B%22up%22:%22dog%22%7D&query=query%20heroes%7Bheroes%7Bname%7D%7D',
      );
      return true;
    });
  });

  test('should include extensions if allowed', () => {
    const link = httpLink.create({
      uri: 'graphql',
      includeExtensions: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      extensions: {
        fooExt: true,
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.extensions.fooExt).toBe(true);
      return true;
    });
  });

  test('should not include extensions if not allowed', () => {
    const link = httpLink.create({
      uri: 'graphql',
      includeExtensions: false,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      extensions: {
        fooExt: true,
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.extensions).toBeUndefined();
      return true;
    });
  });

  test('should support withCredentials', () => {
    const link = httpLink.create({
      uri: 'graphql',
      withCredentials: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.withCredentials).toBe(true);
      return true;
    });
  });

  test('should support headers from constructor options', () => {
    const link = httpLink.create({
      uri: 'graphql',
      headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('X-Custom-Header')).toBe('foo');
      return true;
    });
  });

  test('should support headers from context', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('X-Custom-Header')).toBe('foo');
      return true;
    });
  });

  test('should use clientAwareness from context in headers', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const clientAwareness = {
      name: 'iOS',
      version: '1.0.0',
    };
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        clientAwareness,
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('apollographql-client-name')).toBe(clientAwareness.name);
      expect(req.headers.get('apollographql-client-version')).toBe(clientAwareness.version);
      return true;
    });
  });

  test('should merge headers from context and constructor options', () => {
    const link = httpLink.create({
      uri: 'graphql',
      headers: new HttpHeaders().set('X-Custom-Foo', 'foo'),
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('X-Custom-Bar', 'bar'),
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.headers.get('X-Custom-Foo')).toBe('foo');
      expect(req.headers.get('X-Custom-Bar')).toBe('bar');
      return true;
    });
  });

  test('should support dynamic uri based on context.uri', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      context: {
        uri: 'gql',
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.expectOne('gql');
  });

  test('should prioritize context', () => {
    const link = httpLink.create({
      uri: 'graphql',
      method: 'GET',
      includeExtensions: false,
      includeQuery: true,
      withCredentials: true,
      headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      extensions: {
        foo: 'bar',
      },
      context: {
        uri: 'external-graphql',
        method: 'POST',
        includeExtensions: true,
        includeQuery: false,
        withCredentials: false,
        headers: new HttpHeaders().set('X-Custom-Header', 'bar'),
      },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.url).toBe('external-graphql');
      expect(req.method).toBe('POST');
      expect(req.withCredentials).toBe(false);
      expect(req.body.extensions).toBeDefined();
      expect(req.body.query).not.toBeDefined();
      expect(req.headers.get('X-Custom-Header')).toBe('bar');
      return true;
    });
  });

  test('allows for not sending the query with the request', () => {
    const middleware = new ApolloLink((op, forward) => {
      op.setContext({
        includeQuery: false,
        includeExtensions: true,
      });

      op.extensions.persistedQuery = { hash: '1234' };

      return forward(op);
    });

    const link = middleware.concat(
      httpLink.create({
        uri: 'graphql',
      }),
    );

    execute(link, {
      query: gql`
        query heroes($first: Int!) {
          heroes(first: $first) {
            name
          }
        }
      `,
      variables: {
        first: 5,
      },
    }).subscribe(noop);

    httpBackend.match(req => {
      expect(req.body.query).not.toBeDefined();
      expect(req.body.extensions).toEqual({
        persistedQuery: { hash: '1234' },
      });
      return true;
    });
  });

  test('should set response in context', () =>
    new Promise<void>(done => {
      const afterware = new ApolloLink((op, forward) => {
        return forward(op).pipe(
          map(response => {
            const context = op.getContext();

            expect(context.response).toBeDefined();
            done();

            return response;
          }),
        );
      });
      const link = afterware.concat(
        httpLink.create({
          uri: 'graphql',
        }),
      );

      const data = {
        heroes: [{ name: 'Superman' }],
      };

      execute(link, {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
      }).subscribe(noop);

      httpBackend.expectOne('graphql').flush({ data });
    }));

  test('should work with mergeMap', () =>
    new Promise<void>(done => {
      const apollo = TestBed.inject(Apollo);

      const op1 = {
        query: gql`
          mutation first {
            foo
          }
        `,
      };
      const data1 = {
        foo: true,
      };
      const op2 = {
        query: gql`
          mutation second {
            bar
          }
        `,
      };
      const data2 = {
        bar: true,
      };

      apollo.create({
        link: httpLink.create({
          uri: 'graphql',
        }),
        cache: new InMemoryCache(),
      });

      const m1 = apollo.mutate({
        mutation: op1.query,
      });

      const m2 = apollo.mutate({
        mutation: op2.query,
      });

      m1.pipe(
        mergeMap(() => {
          setTimeout(() => {
            // Resolve second mutation
            httpBackend
              .expectOne(req => req.body.operationName === 'second')
              .flush({
                data: data2,
              });
          });

          return m2;
        }),
      ).subscribe({
        next(result) {
          expect(result.data).toMatchObject(data2);
          done();
        },
        error(error) {
          throw error;
        },
      });

      // Resolve first mutation
      httpBackend
        .expectOne(req => req.body.operationName === 'first')
        .flush({
          data: data1,
        });
    }));

  test('should be able to useGETForQueries', () => {
    const link = httpLink.create({
      uri: 'graphql',
      useGETForQueries: true,
      includeExtensions: true,
    });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: { up: 'dog' },
      extensions: { what: 'what' },
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('GET');
      expect(req.params.get('variables')).toBe(JSON.stringify(op.variables));
      expect(req.params.get('extensions')).toBe(JSON.stringify(op.extensions));
      expect(req.params.get('operationName')).toBe(op.operationName);
      return true;
    });
  });

  test('useGETForQueries should use GET only for queries :)', () => {
    const link = httpLink.create({
      uri: 'graphql',
      useGETForQueries: true,
    });
    const op = {
      query: gql`
        mutation addRandomHero {
          addRandomHero {
            name
          }
        }
      `,
      operationName: 'addRandomHero',
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.operationName).toBe(op.operationName);
      return true;
    });
  });

  test('commas between arguments should not be removed', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        query heroes($first: Int!, $limit: Int!) {
          heroes(first: $first, limit: $limit) {
            name
          }
        }
      `,
      operationName: 'heroes',
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.query).toMatch(',');
      expect(req.body.operationName).toBe(op.operationName);
      return true;
    });
  });

  test('commas between arguments should not be removed in Mutations', () => {
    const link = httpLink.create({
      uri: 'graphql',
    });
    const op = {
      query: gql`
        mutation addRandomHero($name: String!, $level: Int!) {
          addRandomHero(name: $name, level: $level) {
            name
          }
        }
      `,
      operationName: 'addRandomHero',
    };

    execute(link, op).subscribe(noop);

    httpBackend.match(req => {
      expect(req.method).toBe('POST');
      expect(req.body.query).toMatch(',');
      expect(req.body.operationName).toBe(op.operationName);
      return true;
    });
  });

  test('should cancel XHR when unsubscribing', () => {
    const link = httpLink.create({ uri: 'graphql' });
    const op = {
      query: gql`
        query heroes {
          heroes {
            name
          }
        }
      `,
      operationName: 'heroes',
      variables: {},
    };

    execute(link, op)
      .subscribe({
        next: () => {
          throw new Error('Should not be here');
        },
        error: () => {
          throw new Error('Should not be here');
        },
      })
      .unsubscribe();

    expect(httpBackend.expectOne('graphql').cancelled).toBe(true);
  });

  test('should merge httpContext from options and query context and pass it on to HttpClient', () =>
    new Promise<void>(done => {
      const requestSpy = vi.spyOn(TestBed.inject(HttpClient), 'request');
      const optionsToken = new HttpContextToken(() => '');
      const queryToken = new HttpContextToken(() => '');

      const optionsContext = new HttpContext().set(optionsToken, 'foo');
      const queryContext = new HttpContext().set(queryToken, 'bar');

      const link = httpLink.create({ uri: 'graphql', httpContext: optionsContext });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        context: {
          httpContext: queryContext,
        },
      };

      execute(link, op).subscribe(() => {
        const callOptions = requestSpy.mock.calls[0][2];
        expect(callOptions?.context?.get(optionsToken)).toBe('foo');
        expect(callOptions?.context?.get(queryToken)).toBe('bar');
        expect(optionsContext.get(queryToken)).toBe('');
        expect(queryContext.get(optionsToken)).toBe('');
        done();
      });

      httpBackend.expectOne('graphql').flush({ data: {} });
    }));

  describe('HTTP Error Handling', () => {
    test('should convert HTTP 400 to ServerError', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };
      const errorBody = {
        errors: [
          { message: 'Validation error', extensions: { code: 'GRAPHQL_VALIDATION_FAILED' } },
        ],
      };

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(ServerError.is(err)).toBe(true);
          expect(err.statusCode).toBe(400);
          expect(err.message).toBe('Response not successful: Received status code 400');
          expect(err.bodyText).toBe(JSON.stringify(errorBody));
          expect(err.response.ok).toBe(false);
        },
      });

      httpBackend.expectOne('graphql').flush(errorBody, { status: 400, statusText: 'Bad Request' });
    });

    test('should convert HTTP 500 to ServerError', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };
      const errorBody = 'Internal server error';

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(ServerError.is(err)).toBe(true);
          expect(err.statusCode).toBe(500);
          expect(err.message).toBe('Response not successful: Received status code 500');
          expect(err.bodyText).toBe(errorBody);
          expect(err.response.ok).toBe(false);
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush(errorBody, { status: 500, statusText: 'Internal Server Error' });
    });

    test('should include all response properties in ServerError', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };
      const errorBody = { errors: [{ message: 'Not found' }] };
      const customHeaders = new HttpHeaders({
        'X-Custom-Header': 'test-value',
        'X-Request-ID': '12345',
      });

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.response).toBeDefined();
          expect(err.response.status).toBe(404);
          expect(err.response.statusText).toBe('Not Found');
          expect(err.response.ok).toBe(false);
          expect(err.response.url).toBe('graphql');
          expect(err.response.type).toBe('error');
          expect(err.response.redirected).toBe(false);

          // Verify headers were converted from Angular HttpHeaders to native Headers
          expect(err.response.headers).toBeDefined();
          expect(err.response.headers.get('x-custom-header')).toBe('test-value');
          expect(err.response.headers.get('x-request-id')).toBe('12345');
        },
      });

      httpBackend.expectOne('graphql').flush(errorBody, {
        status: 404,
        statusText: 'Not Found',
        headers: customHeaders,
      });
    });

    test('should work in link chain for error handling', () => {
      // Verify ServerError propagates through link chain
      const passThroughLink = new ApolloLink((operation, forward) => {
        return forward(operation);
      });

      const link = httpLink.create({ uri: 'graphql' });
      const combinedLink = ApolloLink.from([passThroughLink, link]);

      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };

      execute(combinedLink, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          // Verify ServerError works through link chain
          expect(err instanceof ServerError).toBe(true);
          expect(ServerError.is(err)).toBe(true);
          expect(err.statusCode).toBe(400);
          expect(err.bodyText).toBeDefined();
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush(
          { errors: [{ message: 'Bad request' }] },
          { status: 400, statusText: 'Bad Request' },
        );
    });

    test('should extract body text from string error', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };
      const errorBody = 'Plain string error message';

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.bodyText).toBe(errorBody);
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush(errorBody, { status: 500, statusText: 'Server Error' });
    });

    test('should extract body text from object error', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };
      const errorBody = { errors: [{ message: 'GraphQL error', path: ['field'] }] };

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.bodyText).toBe(JSON.stringify(errorBody));
        },
      });

      httpBackend.expectOne('graphql').flush(errorBody, { status: 400, statusText: 'Bad Request' });
    });

    test('should extract body text from null error', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.bodyText).toBe('{}');
        },
      });

      httpBackend.expectOne('graphql').flush(null, { status: 500, statusText: 'Server Error' });
    });

    test('should not create ServerError for status 299', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };
      const data = { field: 'value' };

      execute(link, op).subscribe({
        next: result => {
          expect(result).toEqual({ data });
        },
        error: () => {
          throw new Error('Should not error');
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush({ data }, { status: 299, statusText: 'Custom Success' });
    });

    test('should create ServerError for status 300', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed for status 300');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.statusCode).toBe(300);
          expect(err.message).toBe('Response not successful: Received status code 300');
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush({ errors: [{ message: 'Error' }] }, { status: 300, statusText: 'Error' });
    });

    test('should create ServerError for status 404', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed for status 404');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.statusCode).toBe(404);
          expect(err.message).toBe('Response not successful: Received status code 404');
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush({ errors: [{ message: 'Error' }] }, { status: 404, statusText: 'Not Found' });
    });

    test('should create ServerError for status 503', () => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query test {
            field
          }
        `,
        operationName: 'test',
        variables: {},
      };

      execute(link, op).subscribe({
        next: () => {
          throw new Error('Should not succeed for status 503');
        },
        error: err => {
          expect(err instanceof ServerError).toBe(true);
          expect(err.statusCode).toBe(503);
          expect(err.message).toBe('Response not successful: Received status code 503');
        },
      });

      httpBackend
        .expectOne('graphql')
        .flush(
          { errors: [{ message: 'Error' }] },
          { status: 503, statusText: 'Service Unavailable' },
        );
    });
  });
});
