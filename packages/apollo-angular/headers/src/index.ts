import { HttpHeaders } from '@angular/common/http';
import { ApolloLink } from "@apollo/client";

export const httpHeaders = () => {
  return new ApolloLink((operation: ApolloLink.Operation, forward: ApolloLink.ForwardFunction) => {
    const { getContext, setContext } = operation;
    const context = getContext();

    if (context.headers) {
      setContext({
        ...context,
        headers: new HttpHeaders(context.headers),
      });
    }

    return forward(operation);
  });
};
