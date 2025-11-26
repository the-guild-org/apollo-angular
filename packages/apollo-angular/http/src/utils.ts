import { Observable } from 'rxjs';
import { HttpClient, HttpContext, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Body, ExtractedFiles, ExtractFiles, Request } from './types';

export const fetch = (
  req: Request,
  httpClient: HttpClient,
  extractFiles?: ExtractFiles,
): Observable<HttpResponse<Object>> => {
  const shouldUseBody = ['POST', 'PUT', 'PATCH'].indexOf(req.method.toUpperCase()) !== -1;
  const shouldStringify = (param: string) =>
    ['variables', 'extensions'].indexOf(param.toLowerCase()) !== -1;
  const isBatching = (req.body as Body[]).length;
  let shouldUseMultipart = req.options && req.options.useMultipart;
  let multipartInfo: ExtractedFiles;

  if (shouldUseMultipart) {
    if (isBatching) {
      return new Observable(observer =>
        observer.error(new Error('File upload is not available when combined with Batching')),
      );
    }

    if (!shouldUseBody) {
      return new Observable(observer =>
        observer.error(new Error('File upload is not available when GET is used')),
      );
    }

    if (!extractFiles) {
      return new Observable(observer =>
        observer.error(
          new Error(
            `To use File upload you need to pass "extractFiles" function from "extract-files" library to HttpLink's options`,
          ),
        ),
      );
    }

    multipartInfo = extractFiles(req.body);

    shouldUseMultipart = !!multipartInfo.files.size;
  }

  // `body` for some, `params` for others
  let bodyOrParams = {};

  if (isBatching) {
    if (!shouldUseBody) {
      return new Observable(observer =>
        observer.error(new Error('Batching is not available for GET requests')),
      );
    }

    bodyOrParams = {
      body: req.body,
    };
  } else {
    const body = shouldUseMultipart ? multipartInfo!.clone : req.body;

    if (shouldUseBody) {
      bodyOrParams = {
        body,
      };
    } else {
      const params = Object.keys(req.body).reduce((obj: any, param) => {
        const value = (req.body as any)[param];
        obj[param] = shouldStringify(param) ? JSON.stringify(value) : value;
        return obj;
      }, {});

      bodyOrParams = { params: params };
    }
  }

  if (shouldUseMultipart && shouldUseBody) {
    const form = new FormData();

    form.append('operations', JSON.stringify((bodyOrParams as any).body));

    const map: Record<string, any> = {};
    const files = multipartInfo!.files;

    let i = 0;
    files.forEach(paths => {
      map[++i] = paths;
    });

    form.append('map', JSON.stringify(map));

    i = 0;
    files.forEach((_, file) => {
      form.append(++i + '', file, file.name);
    });

    (bodyOrParams as any).body = form;
  }

  // create a request
  return httpClient.request<Object>(req.method, req.url, {
    observe: 'response',
    responseType: 'json',
    reportProgress: false,
    ...bodyOrParams,
    ...req.options,
  });
};

export const mergeHeaders = (
  source: HttpHeaders | undefined,
  destination: HttpHeaders,
): HttpHeaders => {
  if (source && destination) {
    const merged = destination
      .keys()
      .reduce((headers, name) => headers.set(name, destination.getAll(name)!), source);

    return merged;
  }

  return destination || source;
};

export const mergeHttpContext = (
  source: HttpContext | undefined,
  destination: HttpContext,
): HttpContext => {
  if (source && destination) {
    return [...source.keys()].reduce(
      (context, name) => context.set(name, source.get(name)),
      destination,
    );
  }

  return destination || source;
};

export function prioritize<T>(
  ...values: [NonNullable<T>, ...T[]] | [...T[], NonNullable<T>]
): NonNullable<T> {
  return values.find(val => typeof val !== 'undefined') as NonNullable<T>;
}

export function createHeadersWithClientAwareness(context: Record<string, any>) {
  // `apollographql-client-*` headers are automatically set if a
  // `clientAwareness` object is found in the context. These headers are
  // set first, followed by the rest of the headers pulled from
  // `context.headers`.
  let headers =
    context.headers && context.headers instanceof HttpHeaders
      ? context.headers
      : new HttpHeaders(context.headers);

  if (context.clientAwareness) {
    const { name, version } = context.clientAwareness;

    // If desired, `apollographql-client-*` headers set by
    // the `clientAwareness` object can be overridden by
    // `apollographql-client-*` headers set in `context.headers`.

    if (name && !headers.has('apollographql-client-name')) {
      headers = headers.set('apollographql-client-name', name);
    }

    if (version && !headers.has('apollographql-client-version')) {
      headers = headers.set('apollographql-client-version', version);
    }
  }

  return headers;
}
