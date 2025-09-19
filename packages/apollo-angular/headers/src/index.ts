import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from '@apollo/client';

export class HttpHeadersLink extends ApolloLink {
  constructor() {
    super((operation, forward) => {
      const { getContext, setContext } = operation;
      const context = getContext();

      if (context.headers) {
        setContext({ headers: new HttpHeaders(context.headers) });
      }

      return forward(operation);
    });
  }
}

/**
 * @deprecated Use `HttpHeadersLink` instead.
 */
export const httpHeaders = () => {
  return new HttpHeadersLink();
};
