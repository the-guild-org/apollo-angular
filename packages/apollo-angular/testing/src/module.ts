import { Apollo } from 'apollo-angular';
import { Inject, InjectionToken, NgModule, Optional } from '@angular/core';
import {
  ApolloCache,
  ApolloLink,
  InMemoryCache,
  Operation as LinkOperation,
} from '@apollo/client/core';
import { ApolloTestingBackend } from './backend';
import { ApolloTestingController } from './controller';
import { Operation } from './operation';

export type NamedCaches = Record<string, ApolloCache<any> | undefined | null>;

export const APOLLO_TESTING_CACHE = new InjectionToken<ApolloCache<any>>(
  'apollo-angular/testing cache',
);

export const APOLLO_TESTING_NAMED_CACHE = new InjectionToken<NamedCaches>(
  'apollo-angular/testing named cache',
);

export const APOLLO_TESTING_CLIENTS = new InjectionToken<string[]>(
  'apollo-angular/testing named clients',
);

function addClient(name: string, op: LinkOperation): Operation {
  (op as Operation).clientName = name;

  return op as Operation;
}

@NgModule({
  providers: [
    Apollo,
    ApolloTestingBackend,
    { provide: ApolloTestingController, useExisting: ApolloTestingBackend },
  ],
})
export class ApolloTestingModuleCore {
  constructor(
    apollo: Apollo,
    backend: ApolloTestingBackend,
    @Optional()
    @Inject(APOLLO_TESTING_CLIENTS)
    namedClients?: string[],
    @Optional()
    @Inject(APOLLO_TESTING_CACHE)
    cache?: ApolloCache<any>,
    @Optional()
    @Inject(APOLLO_TESTING_NAMED_CACHE)
    namedCaches?: NamedCaches,
  ) {
    function createOptions(name: string, c?: ApolloCache<any> | null) {
      return {
        connectToDevTools: false,
        link: new ApolloLink(operation => backend.handle(addClient(name, operation))),
        cache: c || new InMemoryCache(),
      };
    }

    apollo.create(createOptions('default', cache));

    if (namedClients && namedClients.length) {
      namedClients.forEach(name => {
        const caches = namedCaches && typeof namedCaches === 'object' ? namedCaches : {};

        apollo.createNamed(name, createOptions(name, caches[name]));
      });
    }
  }
}

@NgModule({
  imports: [ApolloTestingModuleCore],
})
export class ApolloTestingModule {
  static withClients(names: string[]) {
    return {
      ngModule: ApolloTestingModuleCore,
      providers: [
        {
          provide: APOLLO_TESTING_CLIENTS,
          useValue: names,
        },
      ],
    };
  }
}
