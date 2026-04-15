[![Angular](https://user-images.githubusercontent.com/25294569/63955021-b99fca80-ca8c-11e9-9362-1ee8083edd2e.gif)](https://www.apollo-angular.com/)

# [Apollo Angular](https://www.apollo-angular.com/) [![npm version](https://badge.fury.io/js/apollo-angular.svg)](https://badge.fury.io/js/apollo-angular)

Apollo Angular allows you to fetch data from your GraphQL server and use it in building complex and
reactive UIs using the Angular framework. Apollo Angular may be used in any context that Angular may
be used. In the browser, in NativeScript, or in Node.js when you want to do server-side rendering.

Apollo Angular requires _no_ complex build setup to get up and running. As long as you have a
GraphQL server you can get started building out your application with Angular immediately. Apollo
Angular works out of the box with both [Angular CLI](https://cli.angular.io/)
(`ng add apollo-angular`) and [NativeScript](https://www.nativescript.org/) with a single install.

Apollo Angular is:

1. **Incrementally adoptable**, so that you can drop it into an existing JavaScript app and start
   using GraphQL for just part of your UI.
1. **Universally compatible**, so that Apollo works with any build setup, any GraphQL server, and
   any GraphQL schema.
1. **Simple to get started with**, so you can start loading data right away and learn about advanced
   features later.
1. **Inspectable and understandable**, so that you can have great developer tools to understand
   exactly what is happening in your app.
1. **Built for interactive apps**, so your users can make changes and see them reflected in the UI
   immediately.
1. **Small and flexible**, so you don't get stuff you don't need. The core is under 12kb compressed.
1. **Community driven**, because Apollo is driven by the community and serves a variety of use
   cases. Everything is planned and developed in the open.

Get started today on the app you’ve been dreaming of, and let Apollo Angular take you to the moon!

## Installation

It is simple to install Apollo Angular and related libraries

```bash
# installing Apollo Angular in Angular CLI
ng add apollo-angular

# installing each piece independently
pnpm add @apollo/client apollo-angular graphql
```

That’s it! You may now use Apollo Angular in any of your Angular environments.

For an amazing developer experience you may also install the
[Apollo Client Developer tools for Chrome](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm)
which will give you inspectability into your Apollo Angular data.

- If you are using Apollo-Client v3, please make sure to use `apollo-angular@v3`
  > If you are using Apollo-Client v2, please make sure to use `apollo-angular@v1` (and for Angular
  > 10 support, make sure to use `v1.10.0`)

## Usage

Now you may create components that are connected to your GraphQL API.

Finally, to demonstrate the power of Apollo Angular in building interactive UIs let us connect one
of your components to your GraphQL server using the `Apollo` service:

```ts
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

@Component({
  selector: 'dogs',
  template: `
    <ul>
      @for (dog of dogs | async; track dog.id) {
        <li>
          {{ dog.breed }}
        </li>
      }
    </ul>
  `,
})
export class DogsComponent implements OnInit {
  public dogs!: Observable<any>;

  constructor(private readonly apollo: Apollo) {}

  ngOnInit() {
    this.dogs = this.apollo
      .watchQuery({
        query: GET_DOGS,
      })
      .valueChanges.pipe(map(result => result.data && result.data.dogs));
  }
}
```

To learn more about querying with Apollo Angular be sure to start reading the
[documentation article on queries](https://apollo-angular.com/docs/data/queries/).

## Documentation

All the documentation for Apollo Angular including usage articles and helpful recipes lives on:
[https://www.apollo-angular.com/](https://www.apollo-angular.com/)

## Contributing

[Read the Apollo Contributor Guidelines.](CONTRIBUTING.md)

This project uses Lerna.

Bootstrapping:

```bash
pnpm install
```

Running tests locally:

```bash
pnpm test
```

Formatting code with prettier:

```bash
pnpm prettier
```

This project uses TypeScript for static typing. You can get it built into your editor with no
configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an
open source IDE which is available for free on all platforms.
