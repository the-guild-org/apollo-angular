import { print } from 'graphql';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApolloLink, FetchResult, Operation } from '@apollo/client/core';
import { pick } from './http-batch-link';
import { Body, Context, OperationPrinter, Options, Request } from './types';
import { createHeadersWithClientAwareness, fetch, mergeHeaders } from './utils';

// XXX find a better name for it
export class HttpLinkHandler extends ApolloLink {
  public requester: (operation: Operation) => Observable<FetchResult> | null;
  private print: OperationPrinter = print;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly options: Options,
  ) {
    super();

    if (this.options.operationPrinter) {
      this.print = this.options.operationPrinter;
    }

    this.requester = (operation: Operation) =>
      new Observable((observer: any) => {
        const context: Context = operation.getContext();

        let method = pick(context, this.options, 'method');
        const includeQuery = pick(context, this.options, 'includeQuery');
        const includeExtensions = pick(context, this.options, 'includeExtensions');
        const url = pick(context, this.options, 'uri');
        const withCredentials = pick(context, this.options, 'withCredentials');
        const useMultipart = pick(context, this.options, 'useMultipart');
        const useGETForQueries = this.options.useGETForQueries === true;

        const isQuery = operation.query.definitions.some(
          def => def.kind === 'OperationDefinition' && def.operation === 'query',
        );

        if (useGETForQueries && isQuery) {
          method = 'GET';
        }

        const req: Request = {
          method,
          url: typeof url === 'function' ? url(operation) : url,
          body: {
            operationName: operation.operationName,
            variables: operation.variables,
          },
          options: {
            withCredentials,
            useMultipart,
            headers: this.options.headers,
          },
        };

        if (includeExtensions) {
          (req.body as Body).extensions = operation.extensions;
        }

        if (includeQuery) {
          (req.body as Body).query = this.print(operation.query);
        }

        const headers = createHeadersWithClientAwareness(context);

        req.options.headers = mergeHeaders(req.options.headers, headers);

        const sub = fetch(req, this.httpClient, this.options.extractFiles).subscribe({
          next: response => {
            operation.setContext({ response });
            observer.next(response.body);
          },
          error: err => observer.error(err),
          complete: () => observer.complete(),
        });

        return () => {
          if (!sub.closed) {
            sub.unsubscribe();
          }
        };
      });
  }

  public request(op: Operation): Observable<FetchResult> | null {
    return this.requester(op);
  }
}

@Injectable({
  providedIn: 'root',
})
export class HttpLink {
  constructor(private readonly httpClient: HttpClient) {}

  public create(options: Options): HttpLinkHandler {
    return new HttpLinkHandler(this.httpClient, options);
  }
}
