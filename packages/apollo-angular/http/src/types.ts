import { DocumentNode } from 'graphql';
import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from '@apollo/client';

declare module '@apollo/client' {
  export interface DefaultContext extends Context {}
}

export type HttpRequestOptions = {
  headers?: HttpHeaders;
  withCredentials?: boolean;
  useMultipart?: boolean;
};

export type URIFunction = (operation: ApolloLink.Operation) => string;

export type FetchOptions = {
  method?: string;
  uri?: string | URIFunction;
  includeExtensions?: boolean;
  includeQuery?: boolean;
};

export type OperationPrinter = (operation: DocumentNode) => string;

export interface Options extends FetchOptions, HttpRequestOptions {
  operationPrinter?: OperationPrinter;
  useGETForQueries?: boolean;
  extractFiles?: ExtractFiles;
}

export type Body = {
  query?: string;
  variables?: Record<string, any>;
  operationName?: string;
  extensions?: Record<string, any>;
};

export interface Context extends FetchOptions, HttpRequestOptions {}

export type Request = {
  method: string;
  url: string;
  body: Body | Body[];
  options: HttpRequestOptions;
};

export type ExtractedFiles = {
  clone: unknown;
  files: Map<any, any>;
};

export type ExtractFiles = (body: Body | Body[]) => ExtractedFiles;

export type BatchOptions = {
  batchMax?: number;
  batchInterval?: number;
  batchKey?: (operation: ApolloLink.Operation) => string;
} & Options;
