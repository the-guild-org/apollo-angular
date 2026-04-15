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
import { ApolloLink, gql } from '@apollo/client';
import { ServerError } from '@apollo/client/errors';
import { getOperationName } from '@apollo/client/utilities/internal';
import { HttpBatchLink } from '../src/http-batch-link';
import { executeWithDefaultContext as execute } from './utils';

const noop = () => {
  //
};

describe('HttpBatchLink', () => {
  let httpLink: HttpBatchLink;
  let httpBackend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpBatchLink],
    });
    httpLink = TestBed.inject(HttpBatchLink);
    httpBackend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  test('should use HttpClient', () =>
    new Promise<void>(done => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };
      const data = {
        heroes: [{ name: 'Superman' }],
      };

      execute(link, op).subscribe({
        next: result => {
          expect(result).toEqual({ data });
          done();
        },
        error: () => {
          throw 'Should not be here';
        },
      });

      setTimeout(() => {
        httpBackend.expectOne('graphql').flush({ data });
      }, 50);
    }));

  test('should fail on uri as function', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: () => '/graphql',
      });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };

      execute(link, op).subscribe({
        next: () => {
          throw 'Should not be here';
        },
        error: () => {
          done();
        },
      });
    }));

  test('should support multiple queries', () =>
    new Promise<void>(done => {
      const link = httpLink.create({ uri: 'graphql', batchKey: () => 'bachKey' });
      const op1 = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };
      const op2 = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };

      execute(link, op1).subscribe(noop);
      execute(link, op2).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.body[0].operationName).toEqual(getOperationName(op1.query));
          expect(req.body[1].operationName).toEqual(getOperationName(op2.query));
          done();
          return true;
        });
      }, 50);
    }));

  test('should send it as JSON with right body and headers', () =>
    new Promise<void>(done => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };

      execute(link, op).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.body[0].operationName).toEqual(getOperationName(op.query));
          expect(req.reportProgress).toEqual(false);
          expect(req.responseType).toEqual('json');
          expect(req.detectContentTypeHeader()).toEqual('application/json');
          done();
          return true;
        });
      }, 50);
    }));

  test('should use POST by default', () =>
    new Promise<void>(done => {
      const link = httpLink.create({ uri: 'graphql' });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };

      execute(link, op).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.method).toEqual('POST');
          expect(req.body[0].operationName).toEqual(getOperationName(op.query));
          expect(req.detectContentTypeHeader()).toEqual('application/json');
          done();
          return true;
        });
      }, 50);
    }));

  test('should be able to specify any method', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: 'graphql',
        method: 'PUT',
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
        variables: { up: 'dog' },
        extensions: { what: 'what' },
      };

      execute(link, op).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.method).toEqual('PUT');
          done();
          return true;
        });
      }, 50);
    }));

  test('should include extensions if allowed', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: 'graphql',
        includeExtensions: true,
        batchKey: () => 'bachKey',
      });
      const op1 = {
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
      const op2 = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        extensions: {
          fooExt: false,
        },
      };

      execute(link, op1).subscribe(noop);
      execute(link, op2).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.body[0].extensions.fooExt).toEqual(true);
          expect(req.body[1].extensions.fooExt).toEqual(false);
          done();
          return true;
        });
      }, 50);
    }));

  test('should support withCredentials', () =>
    new Promise<void>(done => {
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

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.withCredentials).toEqual(true);
          done();
          return true;
        });
      }, 50);
    }));

  describe.each([
    ['Record', true],
    ['HttpHeaders', false],
  ])('Headers as %s', (_, useRecord) => {
    const createHeaders = (name: string, value: string): HttpHeaders | Record<string, string> => {
      return useRecord ? { [name]: value } : new HttpHeaders().set(name, value);
    };

    test('should support headers from constructor options', () =>
      new Promise<void>(done => {
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

        setTimeout(() => {
          httpBackend.match(req => {
            expect(req.headers.get('X-Custom-Header')).toEqual('foo');
            done();
            return true;
          });
        }, 50);
      }));

    test('should support headers from context', () =>
      new Promise<void>(done => {
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
            headers: createHeaders('X-Custom-Header', 'foo'),
          },
        };

        execute(link, op).subscribe(noop);

        setTimeout(() => {
          httpBackend.match(req => {
            expect(req.headers.get('X-Custom-Header')).toEqual('foo');
            done();
            return true;
          });
        }, 50);
      }));

    test('should support headers from context', () =>
      new Promise<void>(done => {
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

        setTimeout(() => {
          httpBackend.match(req => {
            expect(req.headers.get('apollographql-client-name')).toBe(clientAwareness.name);
            expect(req.headers.get('apollographql-client-version')).toBe(clientAwareness.version);
            done();
            return true;
          });
        }, 50);
      }));

    test('should merge headers from context and constructor options', () =>
      new Promise<void>(done => {
        const link = httpLink.create({
          uri: 'graphql',
          headers: new HttpHeaders().set('X-Custom-Foo', 'foo'),
          batchKey: () => 'bachKey',
        });
        const op1 = {
          query: gql`
            query heroes {
              heroes {
                name
              }
            }
          `,
          context: {
            headers: createHeaders('X-Custom-Bar', 'bar'),
          },
        };
        const op2 = {
          query: gql`
            query heroes {
              heroes {
                name
              }
            }
          `,
          context: {
            headers: createHeaders('X-Custom-Baz', 'baz'),
          },
        };

        execute(link, op1).subscribe(noop);
        execute(link, op2).subscribe(noop);

        setTimeout(() => {
          httpBackend.match(req => {
            expect(req.headers.get('X-Custom-Foo')).toEqual('foo');
            expect(req.headers.get('X-Custom-Bar')).toEqual('bar');
            expect(req.headers.get('X-Custom-Baz')).toEqual('baz');
            done();
            return true;
          });
        }, 50);
      }));
  });

  test('should support dynamic uri based on context.uri', () =>
    new Promise<void>(done => {
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

      setTimeout(() => {
        httpBackend.match(req => {
          expect(req.url).toEqual('gql');
          done();
          return true;
        });
      }, 50);
    }));

  test('should prioritize context', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: 'graphql',
        method: 'POST',
        includeExtensions: false,
        includeQuery: true,
        withCredentials: true,
        headers: new HttpHeaders().set('X-Custom-Header', 'foo'),
      });
      const op1 = {
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
          includeExtensions: true,
          includeQuery: false,
          headers: new HttpHeaders().set('X-Custom-Header', 'bar'),
        },
      };

      execute(link, op1).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          // link options should stay untouched
          expect(req.url).toEqual('graphql');
          expect(req.method).toEqual('POST');
          expect(req.withCredentials).toEqual(true);
          // operation #1 options should be overwritten
          expect(req.body[0].extensions).toBeDefined();
          expect(req.body[0].query).not.toBeDefined();
          // operation headers should be prioritized
          expect(req.headers.get('X-Custom-Header')).toEqual('bar');

          done();

          return true;
        });
      }, 50);
    }));

  test('allows for not sending the query with the request', () =>
    new Promise<void>(done => {
      const middleware = new ApolloLink((op, forward) => {
        op.setContext({
          includeQuery: false,
          includeExtensions: true,
          batchKey: () => 'bachKey',
        });

        if (op.operationName === 'op1') {
          op.extensions.persistedQuery = { hash: 'op1-hash' };
        } else if (op.operationName === 'op2') {
          op.extensions.persistedQuery = { hash: 'op2-hash' };
        }

        return forward(op);
      });

      const link = middleware.concat(
        httpLink.create({
          uri: 'graphql',
          batchKey: () => 'bachKey',
        }),
      );

      execute(link, {
        query: gql`
          query op1($first: Int!) {
            heroes(first: $first) {
              name
            }
          }
        `,
        variables: {
          first: 5,
        },
      }).subscribe(noop);
      execute(link, {
        query: gql`
          query op2 {
            heroes {
              name
            }
          }
        `,
      }).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(req => {
          // operation #1
          expect(req.body[0].query).not.toBeDefined();
          expect(req.body[0].extensions).toEqual({
            persistedQuery: { hash: 'op1-hash' },
          });
          // operation #2
          expect(req.body[1].query).not.toBeDefined();
          expect(req.body[1].extensions).toEqual({
            persistedQuery: { hash: 'op2-hash' },
          });

          done();

          return true;
        });
      }, 50);
    }));

  test.skip('should make a separate request per each batchKey', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: 'graphql',
        batchKey: (operation: ApolloLink.Operation) =>
          (operation.getContext().uri as string) || 'graphql',
      });

      execute(link, {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
      }).subscribe(noop);

      execute(link, {
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
      }).subscribe(noop);

      let calls = 0;

      setTimeout(() => {
        httpBackend.match(req => {
          if (req.body[0].operationName === 'op1') {
            // is operation #1
            // has no operation #2
            expect(req.body[1]).not.toBeDefined();
            calls++;
          } else {
            // is operation #2
            expect(req.body[0].operationName).toEqual('op2');
            // has no operation #1
            expect(req.body[1]).not.toBeDefined();
            calls++;
          }

          if (calls === 2) {
            done();
          }

          return true;
        });
      }, 50);
    }));

  test.skip('should batch together only operations with the same options by default', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: 'graphql',
      });

      execute(link, {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
      }).subscribe(noop);

      execute(link, {
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
      }).subscribe(noop);

      let calls = 0;

      setTimeout(() => {
        httpBackend.match(req => {
          if (req.body[0].operationName === 'op1') {
            // is operation #1
            expect(req.url).toEqual('graphql');
            // has no operation #2
            expect(req.body[1]).not.toBeDefined();
            calls++;
          } else {
            // is operation #2
            expect(req.body[0].operationName).toEqual('op2');
            expect(req.url).toEqual('gql');
            // has no operation #1
            expect(req.body[1]).not.toBeDefined();
            calls++;
          }

          if (calls === 2) {
            done();
          }

          return true;
        });
      }, 50);
    }));

  test.skip('should skip batching if requested', () =>
    new Promise<void>(done => {
      const link = httpLink.create({
        uri: 'graphql',
      });

      execute(link, {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
      }).subscribe(noop);

      execute(link, {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        context: {
          skipBatching: true,
        },
      }).subscribe(noop);

      let calls = 0;

      setTimeout(() => {
        httpBackend.match(req => {
          if (req.body[0].operationName === 'op1') {
            // is operation #1
            // has no operation #2
            expect(req.body[1]).not.toBeDefined();
            calls++;
          } else {
            // is operation #2
            expect(req.body[0].operationName).toEqual('op2');
            // has no operation #1
            expect(req.body[1]).not.toBeDefined();
            calls++;
          }

          if (calls === 2) {
            done();
          }

          return true;
        });
      }, 50);
    }));

  test('should cancel XHR when unsubscribing', () =>
    new Promise<void>(done => {
      const link = httpLink.create({ uri: 'graphql', batchMax: 1 });
      const op = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        variables: {},
      };

      execute(link, op)
        .subscribe({
          next: () => {
            throw 'Should not be here';
          },
          error: () => {
            throw 'Should not be here';
          },
        })
        .unsubscribe();

      setTimeout(() => {
        expect(httpBackend.expectOne('graphql').cancelled).toBe(true);
        done();
      }, 50);
    }));

  test('should merge httpContext from options and batch context and pass it on to HttpClient', () =>
    new Promise<void>(done => {
      const requestSpy = vi.spyOn(TestBed.inject(HttpClient), 'request');
      const contextToken1 = new HttpContextToken(() => '');
      const contextToken2 = new HttpContextToken(() => '');
      const contextToken3 = new HttpContextToken(() => '');
      const link = httpLink.create({
        uri: 'graphql',
        httpContext: new HttpContext().set(contextToken1, 'options'),
        batchKey: () => 'batchKey',
      });

      const op1 = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        context: {
          httpContext: new HttpContext().set(contextToken2, 'foo'),
        },
      };

      const op2 = {
        query: gql`
          query heroes {
            heroes {
              name
            }
          }
        `,
        context: {
          httpContext: new HttpContext().set(contextToken3, 'bar'),
        },
      };

      execute(link, op1).subscribe(noop);
      execute(link, op2).subscribe(noop);

      setTimeout(() => {
        httpBackend.match(() => {
          const callOptions = requestSpy.mock.calls[0][2];
          expect(callOptions?.context?.get(contextToken1)).toBe('options');
          expect(callOptions?.context?.get(contextToken2)).toBe('foo');
          expect(callOptions?.context?.get(contextToken3)).toBe('bar');
          done();
          return true;
        });
      }, 50);
    }));

  describe('HTTP Error Handling', () => {
    test('should convert HTTP 400 to ServerError', () =>
      new Promise<void>(done => {
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
            expect(err.bodyText).toBe(JSON.stringify([errorBody]));
            expect(err.response.ok).toBe(false);
            done();
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush([errorBody], { status: 400, statusText: 'Bad Request' });
        }, 50);
      }));

    test('should convert HTTP 500 to ServerError', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush(errorBody, { status: 500, statusText: 'Internal Server Error' });
        }, 50);
      }));

    test('should include all response properties in ServerError', () =>
      new Promise<void>(done => {
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
        const errorBody = [{ errors: [{ message: 'Not found' }] }];
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend.expectOne('graphql').flush(errorBody, {
            status: 404,
            statusText: 'Not Found',
            headers: customHeaders,
          });
        }, 50);
      }));

    test('should work in link chain for error handling', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend.expectOne('graphql').flush([{ errors: [{ message: 'Bad request' }] }], {
            status: 400,
            statusText: 'Bad Request',
          });
        }, 50);
      }));

    test('should extract body text from string error', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush(errorBody, { status: 500, statusText: 'Server Error' });
        }, 50);
      }));

    test('should extract body text from object error', () =>
      new Promise<void>(done => {
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
        const errorBody = [{ errors: [{ message: 'GraphQL error', path: ['field'] }] }];

        execute(link, op).subscribe({
          next: () => {
            throw new Error('Should not succeed');
          },
          error: err => {
            expect(err instanceof ServerError).toBe(true);
            expect(err.bodyText).toBe(JSON.stringify(errorBody));
            done();
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush(errorBody, { status: 400, statusText: 'Bad Request' });
        }, 50);
      }));

    test('should extract body text from null error', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend.expectOne('graphql').flush(null, { status: 500, statusText: 'Server Error' });
        }, 50);
      }));

    test('should not create ServerError for status 299', () =>
      new Promise<void>(done => {
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
            done();
          },
          error: () => {
            throw new Error('Should not error');
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush([{ data }], { status: 299, statusText: 'Custom Success' });
        }, 50);
      }));

    test('should create ServerError for status 300', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush([{ errors: [{ message: 'Error' }] }], { status: 300, statusText: 'Error' });
        }, 50);
      }));

    test('should create ServerError for status 404', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend
            .expectOne('graphql')
            .flush([{ errors: [{ message: 'Error' }] }], { status: 404, statusText: 'Not Found' });
        }, 50);
      }));

    test('should create ServerError for status 503', () =>
      new Promise<void>(done => {
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
            done();
          },
        });

        setTimeout(() => {
          httpBackend.expectOne('graphql').flush([{ errors: [{ message: 'Error' }] }], {
            status: 503,
            statusText: 'Service Unavailable',
          });
        }, 50);
      }));
  });
});
