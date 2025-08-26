import { ApolloLink } from '@apollo/client/link';
import { SetContextLink } from '@apollo/client/link/context';
import { PersistedQueryLink } from '@apollo/client/link/persisted-queries';

export type Options = PersistedQueryLink.Options;

const transformLink = new SetContextLink(context => {
  const ctx: any = {};

  if (context.http) {
    ctx.includeQuery = context.http.includeQuery;
    ctx.includeExtensions = context.http.includeExtensions;
  }

  if (context.fetchOptions && context.fetchOptions.method) {
    ctx.method = context.fetchOptions.method;
  }

  return ctx;
});

export const createPersistedQueryLink = (options: PersistedQueryLink.Options) =>
  ApolloLink.from([new PersistedQueryLink(options), transformLink]);
