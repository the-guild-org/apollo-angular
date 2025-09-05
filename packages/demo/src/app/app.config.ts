import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({
          uri: 'https://swapi-graphql.netlify.app/graphql',
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
