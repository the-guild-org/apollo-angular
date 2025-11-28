import { DocumentNode } from 'graphql';
import { HttpContext, HttpHeaders } from '@angular/common/http';
import { ApolloLink } from '@apollo/client';

declare module '@apollo/client' {
  export interface DefaultContext extends Context {}
}

export type HttpRequestOptions = {
  headers?: HttpHeaders | Record<string, string>;
  withCredentials?: boolean;
  useMultipart?: boolean;
  httpContext?: HttpContext;
};

export type RequestOptions = Omit<HttpRequestOptions, 'headers'> & {
  headers?: HttpHeaders;
};

export type URIFunction = (operation: ApolloLink.Operation) => string;

export type FetchOptions = {
  method?: string;
  uri?: string | URIFunction;
  includeExtensions?: boolean;
  includeQuery?: boolean;
};

export type OperationPrinter = (operation: DocumentNode) => string;

export type Body = {
  query?: string;
  variables?: Record<string, any>;
  operationName?: string;
  extensions?: Record<string, any>;
};

export interface Context extends FetchOptions, HttpRequestOptions {}

type HttpClientRequestOptions = Omit<RequestOptions, 'httpContext'> & { context: HttpContext };

export type Request = {
  method: string;
  url: string;
  body: Body | Body[];
  options: HttpClientRequestOptions;
};

export type ExtractedFiles = {
  clone: unknown;
  files: Map<any, any>;
};

export type ExtractFiles = (body: Body | Body[]) => ExtractedFiles;
