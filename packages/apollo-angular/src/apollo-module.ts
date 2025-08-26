import { Provider } from '@angular/core';
import { ApolloClient } from "@apollo/client";
import { Apollo } from './apollo';
import { APOLLO_FLAGS, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from './tokens';
import { Flags, NamedOptions } from './types';

export function provideApollo<TCacheShape = any>(
  optionsFactory: () => ApolloClient.Options<TCacheShape>,
  flags: Flags = {},
): Provider {
  return [
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: optionsFactory,
    },
    {
      provide: APOLLO_FLAGS,
      useValue: flags,
    },
  ];
}

export function provideNamedApollo(
  optionsFactory: () => NamedOptions,
  flags: Flags = {},
): Provider {
  return [
    Apollo,
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: optionsFactory,
    },
    {
      provide: APOLLO_FLAGS,
      useValue: flags,
    },
  ];
}
