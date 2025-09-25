import { print } from 'graphql';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApolloLink } from '@apollo/client';
import { BatchLink } from '@apollo/client/link/batch';
import type { HttpLink } from './http-link';
import { Body, Context, OperationPrinter, Request } from './types';
import { createHeadersWithClientAwareness, fetch, mergeHeaders, prioritize } from './utils';

export declare namespace HttpBatchLink {
  export type Options = {
    batchMax?: number;
    batchInterval?: number;
    batchKey?: (operation: ApolloLink.Operation) => string;
  } & HttpLink.Options;
}

export const defaults = {
  batchInterval: 10,
  batchMax: 10,
  uri: 'graphql',
  method: 'POST',
  withCredentials: false,
  includeQuery: true,
  includeExtensions: false,
  useMultipart: false,
} as const;

/**
 * Decides which value to pick from Context, Options or defaults
 */
export function pick<K extends keyof Omit<typeof defaults, 'batchInterval' | 'batchMax'>>(
  context: Context,
  options: HttpBatchLink.Options,
  key: K,
): ReturnType<typeof prioritize<Context[K] | HttpBatchLink.Options[K] | (typeof defaults)[K]>> {
  return prioritize(context[key], options[key], defaults[key]);
}

export class HttpBatchLinkHandler extends ApolloLink {
  public batcher: ApolloLink;
  private batchInterval: number;
  private batchMax: number;
  private print: OperationPrinter = print;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly options: HttpBatchLink.Options,
  ) {
    super();

    this.batchInterval = options.batchInterval || defaults.batchInterval;
    this.batchMax = options.batchMax || defaults.batchMax;

    if (this.options.operationPrinter) {
      this.print = this.options.operationPrinter;
    }

    const batchHandler: BatchLink.BatchHandler = (operations: ApolloLink.Operation[]) => {
      return new Observable((observer: any) => {
        const body = this.createBody(operations);
        const headers = this.createHeaders(operations);
        const { method, uri, withCredentials } = this.createOptions(operations);

        if (typeof uri === 'function') {
          throw new Error(`Option 'uri' is a function, should be a string`);
        }

        const req: Request = {
          method,
          url: uri,
          body: body,
          options: {
            withCredentials,
            headers,
          },
        };

        const sub = fetch(req, this.httpClient, () => {
          throw new Error('File upload is not available when combined with Batching');
        }).subscribe({
          next: result => observer.next(result.body),
          error: err => observer.error(err),
          complete: () => observer.complete(),
        });

        return () => {
          if (!sub.closed) {
            sub.unsubscribe();
          }
        };
      });
    };

    const batchKey =
      options.batchKey ||
      ((operation: ApolloLink.Operation) => {
        return this.createBatchKey(operation);
      });

    this.batcher = new BatchLink({
      batchInterval: this.batchInterval,
      batchMax: this.batchMax,
      batchKey,
      batchHandler,
    });
  }

  private createOptions(
    operations: ApolloLink.Operation[],
  ): Required<Pick<HttpBatchLink.Options, 'method' | 'uri' | 'withCredentials'>> {
    const context: Context = operations[0].getContext();

    return {
      method: pick(context, this.options, 'method'),
      uri: pick(context, this.options, 'uri'),
      withCredentials: pick(context, this.options, 'withCredentials'),
    };
  }

  private createBody(operations: ApolloLink.Operation[]): Body[] {
    return operations.map(operation => {
      const includeExtensions = prioritize(
        operation.getContext().includeExtensions,
        this.options.includeExtensions,
        false,
      );
      const includeQuery = prioritize(
        operation.getContext().includeQuery,
        this.options.includeQuery,
        true,
      );

      const body: Body = {
        operationName: operation.operationName,
        variables: operation.variables,
      };

      if (includeExtensions) {
        body.extensions = operation.extensions;
      }

      if (includeQuery) {
        body.query = this.print(operation.query);
      }

      return body;
    });
  }

  private createHeaders(operations: ApolloLink.Operation[]): HttpHeaders {
    return operations.reduce(
      (headers: HttpHeaders, operation: ApolloLink.Operation) => {
        const { headers: contextHeaders } = operation.getContext();
        return contextHeaders ? mergeHeaders(headers, contextHeaders) : headers;
      },
      createHeadersWithClientAwareness({
        headers: this.options.headers,
        clientAwareness: operations[0]?.getContext()?.clientAwareness,
      }),
    );
  }

  private createBatchKey(operation: ApolloLink.Operation): string {
    const context: Context & { skipBatching?: boolean } = operation.getContext();

    if (context.skipBatching) {
      return Math.random().toString(36).substring(2, 11);
    }

    const headers =
      context.headers && context.headers.keys().map((k: string) => context.headers!.get(k));

    const opts = JSON.stringify({
      includeQuery: context.includeQuery,
      includeExtensions: context.includeExtensions,
      headers,
    });

    return prioritize(context.uri, this.options.uri, '') + opts;
  }

  public request(
    op: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction,
  ): Observable<ApolloLink.Result> {
    return this.batcher.request(op, forward);
  }
}

@Injectable({
  providedIn: 'root',
})
export class HttpBatchLink {
  constructor(private readonly httpClient: HttpClient) {}

  public create(options: HttpBatchLink.Options): HttpBatchLinkHandler {
    return new HttpBatchLinkHandler(this.httpClient, options);
  }
}
