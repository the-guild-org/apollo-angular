import { InjectionToken } from '@angular/core';
import type { ApolloClient } from '@apollo/client';
import type { Flags, NamedOptions } from './types';

export const APOLLO_FLAGS = new InjectionToken<Flags>('APOLLO_FLAGS');

export const APOLLO_OPTIONS = new InjectionToken<ApolloClient.Options>('APOLLO_OPTIONS');

export const APOLLO_NAMED_OPTIONS = new InjectionToken<NamedOptions>('APOLLO_NAMED_OPTIONS');
