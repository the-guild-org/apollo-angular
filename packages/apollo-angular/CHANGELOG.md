# Change log

## 11.0.0

### Major Changes

- [#2360](https://github.com/the-guild-org/apollo-angular/pull/2360)
  [`20a418e`](https://github.com/the-guild-org/apollo-angular/commit/20a418e06e09c6cb71ad3c8e4f55b5d6d294876d)
  Thanks [@mark7-bell](https://github.com/mark7-bell)! - Drop support for Angular 17

- [#2364](https://github.com/the-guild-org/apollo-angular/pull/2364)
  [`bdb302a`](https://github.com/the-guild-org/apollo-angular/commit/bdb302abf042978a3c8f19c9a8d75153ec067ab8)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Drop support for GraphQL 15

- [#2360](https://github.com/the-guild-org/apollo-angular/pull/2360)
  [`f311133`](https://github.com/the-guild-org/apollo-angular/commit/f311133bc45241d002f48234af5fd62afcfbacdc)
  Thanks [@mark7-bell](https://github.com/mark7-bell)! - Support Angular 20

### Patch Changes

- [#2364](https://github.com/the-guild-org/apollo-angular/pull/2364)
  [`bdb302a`](https://github.com/the-guild-org/apollo-angular/commit/bdb302abf042978a3c8f19c9a8d75153ec067ab8)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:
  - Updated dependency [`graphql@^16.0.0` ↗︎](https://www.npmjs.com/package/graphql/v/16.0.0) (from
    `^15.0.0 || ^16.0.0`, in `peerDependencies`)

## 10.0.3

### Patch Changes

- [#2351](https://github.com/the-guild-org/apollo-angular/pull/2351)
  [`61ff0b8`](https://github.com/the-guild-org/apollo-angular/commit/61ff0b8e5257f20cae45e84fd724498ff63acc44)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - `fetchMore` typing is duplicated from
  `@apollo/client`

## 10.0.2

### Patch Changes

- [#2347](https://github.com/the-guild-org/apollo-angular/pull/2347)
  [`67b8b8c`](https://github.com/the-guild-org/apollo-angular/commit/67b8b8cb401bdc63222b136133934e67a99dafc1)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - `fetchMore` typing was too loose

## 10.0.1

### Patch Changes

- [#2344](https://github.com/the-guild-org/apollo-angular/pull/2344)
  [`3ef5483`](https://github.com/the-guild-org/apollo-angular/commit/3ef5483a02b788fe1ce9de7f66f2a71be334f45c)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - `FormattedExecutionResult` instead of
  `ExecutionResult`

## 10.0.0

### Major Changes

- [#2342](https://github.com/the-guild-org/apollo-angular/pull/2342)
  [`baf538a`](https://github.com/the-guild-org/apollo-angular/commit/baf538aeb1f76f0835c84f6979589cbf2dfd0f0b)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Drop deprecated things:

  - Instead of `ApolloModule`, use either `provideApollo()` or `provideNamedApollo()`.
  - Instead of `import {graphql} from 'apollo-angular';` use
    `import {gql as graphql} from 'apollo-angular';`

## 9.0.0

### Major Changes

- [#2340](https://github.com/the-guild-org/apollo-angular/pull/2340)
  [`6d3d5ba`](https://github.com/the-guild-org/apollo-angular/commit/6d3d5ba67a5a8d2778a021f1059559379ff99e8f)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - - Requires `@apollo/client` 3.13.1
  - Dropped `SubscriptionResult`, because it added extra maintenance work to keep native types in
    sync, and it brought no value over using native type.
    `diff     - import type { SubscriptionResult } from 'apollo-angular';     + import type { FetchResult } from '@apollo/client/core';     `
  - Most methods of `QueryRef` forward types from `@apollo/client`. That should allow always using
    correct types from whichever `@apollo/client` version is installed without needing to touch
    `apollo-angular`.
  - `QueryRef.valueChanges` and `QueryRef.queryId` are readonly, because there is no reason for
    those to be re-affected.

### Patch Changes

- [#2340](https://github.com/the-guild-org/apollo-angular/pull/2340)
  [`88656f0`](https://github.com/the-guild-org/apollo-angular/commit/88656f00f4f4f8c757ef19e35b172a647e6e2300)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:
  - Updated dependency
    [`@apollo/client@^3.13.1` ↗︎](https://www.npmjs.com/package/@apollo/client/v/3.13.1) (from
    `^3.10.0`, in `peerDependencies`)

## 8.0.2

### Patch Changes

- [#2336](https://github.com/the-guild-org/apollo-angular/pull/2336)
  [`78b0ba1`](https://github.com/the-guild-org/apollo-angular/commit/78b0ba18706d0cf3dd6a877520ae02bc7ede0220)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Export MutationOptionsAlone,
  QueryOptionsAlone, SubscriptionOptionsAlone, WatchQueryOptionsAlone from 'apollo-angular'

## 8.0.1

### Patch Changes

- [#2333](https://github.com/the-guild-org/apollo-angular/pull/2333)
  [`9866ec6`](https://github.com/the-guild-org/apollo-angular/commit/9866ec675a0f38602aabe4ca3fd591e4d9f3248f)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:

  - Updated dependency
    [`@apollo/client@^3.10.0` ↗︎](https://www.npmjs.com/package/@apollo/client/v/3.10.0) (from
    `^3.0.0`, in `peerDependencies`)

- [#2333](https://github.com/the-guild-org/apollo-angular/pull/2333)
  [`eeec0a9`](https://github.com/the-guild-org/apollo-angular/commit/eeec0a96c52e891620d072158166f9ad5de6dc00)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Requires @apollo/client ^3.10.0 for
  watchFragment

## 8.0.0

### Major Changes

- [#2316](https://github.com/the-guild-org/apollo-angular/pull/2316)
  [`8c75368`](https://github.com/the-guild-org/apollo-angular/commit/8c75368d4c433fdb0fd5b0615e5eda404e14b1aa)
  Thanks [@Frozen-byte](https://github.com/Frozen-byte)! - added a `complete()` method for
  `TestOperation` object to cancel subscriptions after `flush()`

  BREAKING CHANGE: subscription observables must be manually completed by the `complete()` method.

### Patch Changes

- [#2323](https://github.com/the-guild-org/apollo-angular/pull/2323)
  [`095457d`](https://github.com/the-guild-org/apollo-angular/commit/095457d609239ee2de636376b62159e420e1df54)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:

  - Updated dependency
    [`@angular/core@^17.0.0 || ^18.0.0 || ^19.0.0` ↗︎](https://www.npmjs.com/package/@angular/core/v/17.0.0)
    (from `^17.0.0 || ^18.0.0`, in `peerDependencies`)

- [#2319](https://github.com/the-guild-org/apollo-angular/pull/2319)
  [`cafb23a`](https://github.com/the-guild-org/apollo-angular/commit/cafb23a797371b2f4df5aae4891cf528cdbcfa58)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Move away from deprecated things

- [#2317](https://github.com/the-guild-org/apollo-angular/pull/2317)
  [`a564953`](https://github.com/the-guild-org/apollo-angular/commit/a5649533e12a589e8d7171ad2b320ee426c8c21d)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Let typing flow better

## 7.2.1

### Patch Changes

- [#2312](https://github.com/the-guild-org/apollo-angular/pull/2312)
  [`8bbdc6b`](https://github.com/the-guild-org/apollo-angular/commit/8bbdc6be14b389d9bcb52887fadb4e239e85a58d)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Smaller bundle for `gql`

- [#2314](https://github.com/the-guild-org/apollo-angular/pull/2314)
  [`e98e06a`](https://github.com/the-guild-org/apollo-angular/commit/e98e06a1a9d9da9e81becf905c738171d797f745)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Deprecate `graphql` alias for `gql` tag
  function

  Because importing the same thing from two different import points will increase the final bundle
  size. If you want a different name for the tag function, then use `as` syntax, such as:

  ```ts
  import { gql as graphql } from 'apollo-angular';
  ```

## 7.2.0

### Minor Changes

- [#2296](https://github.com/the-guild-org/apollo-angular/pull/2296)
  [`6a45784`](https://github.com/the-guild-org/apollo-angular/commit/6a45784ce4e916e9e2df1ee11f579b70edd8445d)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - New `provideApollo()` and
  `provideNamedApollo()`

### Patch Changes

- [#2294](https://github.com/the-guild-org/apollo-angular/pull/2294)
  [`d56c5cb`](https://github.com/the-guild-org/apollo-angular/commit/d56c5cb169847b3d65724c00bcc8c3223de05bac)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Update documentation to standalone usage

- [#2292](https://github.com/the-guild-org/apollo-angular/pull/2292)
  [`04fdd28`](https://github.com/the-guild-org/apollo-angular/commit/04fdd28ff6aa3b4b844488c5b20a55f0bfa60e19)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Relax type to be able to use `extract-files`
  properly

## 7.1.2

### Patch Changes

- [#2289](https://github.com/the-guild-org/apollo-angular/pull/2289)
  [`d78cc8d`](https://github.com/the-guild-org/apollo-angular/commit/d78cc8d27a8d6aca805f0da1eb4e0764c7fb6212)
  Thanks [@richard-elastique](https://github.com/richard-elastique)! - Don't require a dependency on
  React

## 7.1.1

### Patch Changes

- [#2286](https://github.com/the-guild-org/apollo-angular/pull/2286)
  [`dbd4f68`](https://github.com/the-guild-org/apollo-angular/commit/dbd4f6885da9d897fe41d6625a1090454ce996ab)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Permissions for release provenance

## 7.1.0

### Minor Changes

- [#2226](https://github.com/the-guild-org/apollo-angular/pull/2226)
  [`4ca9c4a`](https://github.com/the-guild-org/apollo-angular/commit/4ca9c4a09446be00ba5882bd80e397f70cd9fb51)
  Thanks [@alessbell](https://github.com/alessbell)! - Exposes `watchFragment` method on the
  `ApolloBase` class.

## 7.0.2

### Patch Changes

- [#2259](https://github.com/the-guild-org/apollo-angular/pull/2259)
  [`78f319a`](https://github.com/the-guild-org/apollo-angular/commit/78f319a6a93268144bbb9dc42c84bd45f50ff606)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:

  - Updated dependency
    [`@angular/core@^17.0.0 || ^18.0.0` ↗︎](https://www.npmjs.com/package/@angular/core/v/17.0.0)
    (from `^17.0.0`, in `peerDependencies`)

- [#2259](https://github.com/the-guild-org/apollo-angular/pull/2259)
  [`97fba6a`](https://github.com/the-guild-org/apollo-angular/commit/97fba6ab7909c2d65bd58f7e376a94c0b4394249)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:

  - Updated dependency
    [`@angular/core@^17.0.0 || ^18.0.0` ↗︎](https://www.npmjs.com/package/@angular/core/v/17.0.0)
    (from `^17.0.0`, in `peerDependencies`)

- [#2259](https://github.com/the-guild-org/apollo-angular/pull/2259)
  [`29b9fdc`](https://github.com/the-guild-org/apollo-angular/commit/29b9fdc2279d3e48a46db0a8e811dac0a3b72c00)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - Allow Angular 18

## 7.0.1

### Patch Changes

- [#2252](https://github.com/the-guild-org/apollo-angular/pull/2252)
  [`67ba1e8`](https://github.com/the-guild-org/apollo-angular/commit/67ba1e88ed6aa231bff4b7e794b5b864d5b3a114)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - ApolloClient does not delay the application
  becoming stable

## 7.0.0

### Major Changes

- [#2225](https://github.com/the-guild-org/apollo-angular/pull/2225)
  [`712205f`](https://github.com/the-guild-org/apollo-angular/commit/712205fd8762b1125d614cb58c9fcffcc9135a55)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - BREAKING use Typescript strict mode

  This is breaking because:

  - `ApolloBase.client` throws an error if no client has been created beforehand. The behavior now
    matches the typing that always declared a client existed. In most cases, you should pass either
    `apolloOptions` or `apolloNamedOptions` to `Apollo.constructor` to create the client immediately
    upon construction.
  - `ApolloBase.query()`, `ApolloBase.mutate()` and `ApolloBase.subscribe()` all have a new
    constraint on `V`. If you inherit from this class, you might need to adjust your typing.
  - Classes that inherit `Query`, `Mutation` and `Subscription` must declare the `document` member.
    This requirement always existed at runtime but was not enforced at compile time until now. If
    you generated code, you have nothing to do.
  - `QueryRef.getLastResult()` and `QueryRef.getLastError()` might return `undefined`. This was
    always the case, but was typed incorrectly until now.
  - `pickFlag()` was dropped without any replacement.
  - `createPersistedQueryLink()` requires options. This was always the case but was typed
    incorrectly until now.

## 6.0.0

### Major Changes

- [#2093](https://github.com/the-guild-org/apollo-angular/pull/2093)
  [`fbd86daf`](https://github.com/the-guild-org/apollo-angular/commit/fbd86daf1a413695ad1f5dfcddd652ce73590b42)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - - Add Angular 17 Support
  - Drop support for Angular 14, 15 and 16
  - Support for `ng add` schematics for standalone apps or module apps

### Patch Changes

- [#2093](https://github.com/the-guild-org/apollo-angular/pull/2093)
  [`e0bec09a`](https://github.com/the-guild-org/apollo-angular/commit/e0bec09a877cb617d96dea0f3379925d39458e6a)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:
  - Updated dependency
    [`@angular/core@^17.0.0` ↗︎](https://www.npmjs.com/package/@angular/core/v/17.0.0) (from
    `^14.0.0 || ^15.0.0 || ^16.0.0`, in `peerDependencies`)

## 5.0.2

### Patch Changes

- [#2074](https://github.com/the-guild-org/apollo-angular/pull/2074)
  [`f014edcb`](https://github.com/the-guild-org/apollo-angular/commit/f014edcbfc3396de52c70c5deea194049ac7e746)
  Thanks [@vz-tl](https://github.com/vz-tl)! - Disable dev-tool check when using ApolloTestingModule

## 5.0.1

### Patch Changes

- [#2065](https://github.com/the-guild-org/apollo-angular/pull/2065)
  [`78947ba5`](https://github.com/the-guild-org/apollo-angular/commit/78947ba59d5fe791fb813471c7823fc931279f11)
  Thanks [@PowerKiKi](https://github.com/PowerKiKi)! - dependencies updates:
  - Updated dependency [`tslib@^2.6.2` ↗︎](https://www.npmjs.com/package/tslib/v/2.6.2) (from
    `^2.0.0`, in `dependencies`)

## 5.0.0

### Major Changes

- [#2010](https://github.com/the-guild-org/apollo-angular/pull/2010)
  [`ea8b7034`](https://github.com/the-guild-org/apollo-angular/commit/ea8b70343ef024e1d24eccf578909704f5de2ebe)
  Thanks [@HendrikJanssen](https://github.com/HendrikJanssen)! - Support Angular 16

  This is a breaking change because support for node v14 must be dropped to follow Angular 16
  requirements.

## 4.2.1

### Patch Changes

- [#1910](https://github.com/the-guild-org/apollo-angular/pull/1910)
  [`ff0b0d72`](https://github.com/the-guild-org/apollo-angular/commit/ff0b0d721f847b536b3ba5dd4b598e2055d4532f)
  Thanks [@phryneas](https://github.com/phryneas)! - `TVariable` generics now
  `extend OperationVariables` to accommodate an upstream type change in @apollo/client@3.7.6. #1910,
  #1907

## v4.2.0

- Support Angular 15
- Support Node 18
- Fix broken published package

## v4.1.1

- Fix creating default client when using named options (`APOLLO_NAMED_OPTIONS`)
- Support newest zone.js #1841

## v4.1.0

- Support `@apollo/client` v3.7.X
- Fix typescript issue with `MutationResult` type #1818

## v4.0.1

- Add missing `apollo-angular/persisted-queries` and `apollo-angular/testing`

## v4.0.0

- Support Angular v14

## v3.0.1

- Fix previously corrupted distribution of `apollo-angular` package.

## v3.0.0

- `useGETForQueries` in Http Link
  [`5996109`](https://github.com/the-guild-org/apollo-angular/commit/599610934e5f9cf8cc2d62abc270edddc937cc60)
- Bring back `ApolloModule`
  [`0a24c4f`](https://github.com/the-guild-org/apollo-angular/commit/0a24c4f7af8189a825483c57b2d60cb7a875b18f)
- Fix `useInitialLoading`
  [`750429c`](https://github.com/the-guild-org/apollo-angular/commit/750429cbe0aaad07a3fdc2e2ef046fe8be4aad28)
- Typed `gql` and `graphql` tags - both accept two generic types and support `TypedDocumentNode`
  [`9a8ea5f`](https://github.com/the-guild-org/apollo-angular/commit/9a8ea5f229cf7937d74332092cb3eba40828b7b1)
- Add `useMutationLoading` flag
  [`bc223fe`](https://github.com/the-guild-org/apollo-angular/commit/bc223fe6487edd35c56ad908e4739580ce69f056)
- Fix type inference for Mutations [#1659](https://github.com/the-guild-org/apollo-angular/pull/1659)
- Declare support for Angular 13
- Remove `extract-files` library from dependencies (you need to pass `extractFiles` function to
  HttpLink's options)

**Migration from v2 to v3**

1. Use `ApolloModule` in your NgModule to provide `Apollo` service
2. If you're using old version of `graphql`, update to latest v15 or v16.
3. In case of file uploads, import `extractFiles` from `extract-files` library and pass it to
   `HttpLink.create({ ..., extractFiles })`
4. Done.

## v2.6.0

- Support `TypedDocumentNode`
  [`120594a`](https://github.com/the-guild-org/apollo-angular/commit/120594a3f744e0d233ede3239b08e6721cb35d54)

## v2.5.0

- Declare support for Angular 12

## v2.4.0

- Fix: Use let in Apollo constructor due to firefox bug
  [#1632](https://github.com/the-guild-org/apollo-angular/pull/1632)
- Adds `operationPrinter` option to replace operation printing logic in `HttpLink` and
  `HttpBatchLink` [#1637](https://github.com/the-guild-org/apollo-angular/pull/1637)

## v2.3.0

- `830da182` build: Allows zone.js v11
  [#1629](https://github.com/the-guild-org/apollo-angular/pull/1629)
- `136663f0` docs: Update queries.md
  [#1616](https://github.com/the-guild-org/apollo-angular/pull/1616)

## v2.2.0

- `b152d53` Added Angular 11 peer dependency
  [#1615](https://github.com/the-guild-org/apollo-angular/pull/1615)
- `d179a66` docs: Integrated documentation changes
  [#1590](https://github.com/the-guild-org/apollo-angular/pull/1590)
- `5d938a3` Update README.md [#1598](https://github.com/the-guild-org/apollo-angular/pull/1598)
- `60b8445` fix: test data modification
  [#1596](https://github.com/the-guild-org/apollo-angular/pull/1596)

## v2.1.0

- Move `apollo-angular-link-persisted` to `apollo-angular/persisted-queries` (support Apollo Client
  3.0)
- Support `clientAwareness` (`apollographql-client-name` and `apollographql-client-version` headers)
  in `HttpLink` and `HttpBatchLink`

## v2.0.4

- Fix v2 migration: default export (`ApolloClient`) of `apollo-client`
- Use TypeScript to parse JSON files (supports comments in JSON)

## v2.0.3

- Use JSON.parse to parse `package.json` file in v2 migration

## v2.0.2

- Fix duplicated imports in v2 migration

## v2.0.1

- Fix missing migration code

## v2.0.0

Migration from v1.0 to v2.0:

    ng update apollo-angular

List of breaking changes and a migration strategy available on our
["Migration Guide"](https://apollo-angular.com/docs/migration).

Changes:

- Support Apollo Client 3.0 (use `@apollo/client/core`)
- `Http`, `HttpBatch` and `Headers` links are now part of apollo-angular: `apollo-angular/http` and
  `apollo-angular/headers`
- Re-export `gql` of `graphql-tag` (`import { gql } from 'apollo-angular'`)
- Add `flushData` method to `TestingOperation`
  ([PR #1474](https://github.com/the-guild-org/apollo-angular/pull/1474) by
  [@fetis](https://github.com/fetis))
- Remove `apollo-angular-boost` and `apollo-angular-cache-ngrx`

## v1.10.0

- Support Angular 10

## v1.9.1

- Fix an issue with TypeScript prior v3.5 - private get accessor
  [#1491](https://github.com/the-guild-org/apollo-angular/issues/1491)

## v1.9.0

- Bump version ranges for GraphQL and Apollo Link

## v1.8.0

- Introduces `APOLLO_NAMED_OPTIONS` token. Allows to create named Apollo clients using Dependency
  Injection ([PR #1365](https://github.com/the-guild-org/apollo-angular/pull/1365))
- Allow to test named Apollo client
  ([PR #1365](https://github.com/the-guild-org/apollo-angular/pull/1365))

## v1.7.0

- Fixed type definition for subscribe
  [PR #1290](https://github.com/the-guild-org/apollo-angular/pull/1290)
- Fix global scope naming for UMD build
  [PR #1305](https://github.com/the-guild-org/apollo-angular/pull/1305)
- Introduce useInitialLoading in watch
  [PR #1306](https://github.com/the-guild-org/apollo-angular/pull/1306)

## v1.6.0

- Angular 8 [PR #1206](https://github.com/the-guild-org/apollo-angular/pull/1206)
- Bumps packages in schematics

## v1.5.0

- Use more generic types and make everything more strict
  [PR #885](https://github.com/the-guild-org/apollo-angular/pull/885)
- Angular 7 [PR #913](https://github.com/the-guild-org/apollo-angular/pull/913)

## v1.4.1

- schematics: bump dependencies

## v1.4.0

- Support named clients in Query, Mutatio and Subscription classes
  [PR #799](https://github.com/the-guild-org/apollo-angular/pull/799)

## v1.3.0

- Make `Subscription` generic [PR #778](https://github.com/the-guild-org/apollo-angular/pull/778)
- Schematics (`ng add apollo-angular`)
  [PR #779](https://github.com/the-guild-org/apollo-angular/pull/779),
  [PR #780](https://github.com/the-guild-org/apollo-angular/pull/780)
- Allow to use a custom ApolloCache while testing
  [PR #786](https://github.com/the-guild-org/apollo-angular/pull/786)

## v1.2.0

- Expose `queryId` in `QueryRef` [PR #733](https://github.com/the-guild-org/apollo-angular/pull/733)
- Introduce `Query`, `Mutation`, `Subscription` services
  [PR #622](https://github.com/the-guild-org/apollo-angular/pull/622)
- Angular 6.1 is now required (because of TypeScript 2.8)
- TypeScript 2.8 is now required (because of Omit type)
- Apollo Client ^2.3.4 is now required (versions before are not compatible because of the change in
  apollo-client)

## v1.1.2

## v1.1.1

- Fix typescript compilation errors caused by recent Apollo Client interface changes.
  [Issue #659](https://github.com/the-guild-org/apollo-angular/issues/659)
  [PR #660](https://github.com/the-guild-org/apollo-angular/pull/660)

## v1.1.0

- Introduces `ExtraSubscriptionOptions`. Allows to run `Apollo.subscribe` outside the Zone
  ([PR #488](https://github.com/the-guild-org/apollo-angular/pull/488))
- Introduces `apollo-angular/testing` tools
  ([PR #592](https://github.com/the-guild-org/apollo-angular/pull/592))
- Introduces `APOLLO_OPTIONS` token. Allows to create Apollo using Dependency Injection
  ([PR #607](https://github.com/the-guild-org/apollo-angular/pull/607))
- Adds `sideEffects: false` (webpack)
  ([PR #580](https://github.com/the-guild-org/apollo-angular/pull/580))
- Supports Angular 6 and RxJS 6 ([PR #580](https://github.com/the-guild-org/apollo-angular/pull/580))

## v1.0.1

- Brings typed variables to `QueryRef`

## v1.0.0

- Supports **ApolloClient 2.0**
- Supports ApolloLinks and ApolloCache
- Supports **Angular v5**
- Possible to combine Apollo with anything from Angular's Dependency Injection
- Supports **NativeScript**
- Simpler and less error prone API for watching queries thanks to `QueryRef`
- More AoT friendly
- Brings back Server-Side Rendering
- Allows to type the operation variables

**BREAKING CHANGES:** - [see Migration](https://apollo-angular.com/docs/1.0/migration)

- Drops `apollo-client-rxjs` (thanks to `QueryRef`)
- Replaces`ApolloQueryObservable` with `QueryRef`
- Introduces new API for defining multiple clients (`Apollo.create`, `Apollo.createDefault`,
  `Apollo.createNamed`)
- No longer exposes `ClientMap`, `ClientMapWrapper`, `ClientWrapper`
- Removes 'variables as Observables' feature

## v0.13.3

- Don't reuse options object for mutate and query
  ([PR #356](https://github.com/the-guild-org/apollo-angular/pull/356))

## v0.13.2

- Use `InjectionToken`, instead of deprecated `OpaqueToken`
  ([PR #358](https://github.com/the-guild-org/apollo-angular/pull/358))
- Expose `ClientMap`, `ClientMapWrapper`, `ClientWrapper`
  ([PR #360](https://github.com/the-guild-org/apollo-angular/pull/360))
- Allow to install the library directly from git (NPM v5+ required)
  ([PR #362](https://github.com/the-guild-org/apollo-angular/pull/362))
- Fix AoT issue in Angular 5 **(added InjectDecorator on ClientMap in Apollo)**
  ([PR #365](https://github.com/the-guild-org/apollo-angular/pull/365))

## v0.13.1

- Update dependencies ([PR #347](https://github.com/the-guild-org/apollo-angular/pull/304))
- **Potential breaking change:** Run a GraphQL Operation on subscribe, applies to `mutate()` and
  `query()` ([PR #304](https://github.com/the-guild-org/apollo-angular/pull/304))

## v0.13.0

- Run `subscribe`, `mutate` and `query` within a Zone
  ([PR #297](https://github.com/the-guild-org/apollo-angular/pull/297))

## v0.12.0

- Support `apollo-client@1.0.0-rc.2`
  ([PR #290](https://github.com/the-guild-org/apollo-angular/pull/290))
- Support `jsnext:main` ([PR #277](https://github.com/the-guild-org/apollo-angular/pull/277))

## v0.11.0

- Remove `DeprecatedWatchQueryOptions` and use `WatchQueryOptions`
  ([PR #274](https://github.com/the-guild-org/apollo-angular/pull/274))

**After updating to**
([`apollo-client-rxjs@0.5.0`](https://github.com/the-guild-org/apollo-client-rxjs/blob/master/CHANGELOG.md#v050))

- Add `result()`, `currentResult()`, `variables`, `setOptions`, `setVariables` to
  `ApolloQueryObservable`
- **BREAKING CHANGE:** `ApolloQueryObservable` shares now a generic type with `ApolloQueryResult`

**Before:**

```ts
class AppComponent {
  users: ApolloQueryObservable<ApolloQueryResult<{}>>;
}
```

**Now:**

```ts
class AppComponent {
  users: ApolloQueryObservable<{}>;
}
```

Behaves the same as the `ObservableQuery` of `apollo-client`.

## v0.10.0

- **BRAKING CHANGE** Change name of the service to `Apollo`, instead of `Angular2Apollo`
  ([PR #262](https://github.com/the-guild-org/apollo-angular/pull/262))
- Introduce multiple clients ([PR #263](https://github.com/the-guild-org/apollo-angular/pull/263))

## v0.9.0

- Support `apollo-client@0.8.0` ([PR #206](https://github.com/the-guild-org/apollo-angular/pull/206))
- Support `es6` modules and `tree-shaking`
  ([PR #151](https://github.com/the-guild-org/apollo-angular/pull/151),
  [PR #206](https://github.com/the-guild-org/apollo-angular/pull/206))
- Make our `Ahead-of-Time` compilation compatible with Angular 2.3+
  ([PR #189](https://github.com/the-guild-org/apollo-angular/pull/189),
  [PR #195](https://github.com/the-guild-org/apollo-angular/pull/195))
- Added `getClient()` that exposes an instance of ApolloClient
  ([PR #203](https://github.com/the-guild-org/apollo-angular/pull/203))
- **BREAKING CHANGE** The way to provide an instance of ApolloClient has changed,
  [see how](https://github.com/apollographql/angular2-docs/pull/23)
- **BREAKING CHANGE** Change the name of the package. Use `apollo-angular` instead of
  `angular2-apollo`, which is now deprecated

## v0.8.0

- Made `mutate()` and `query()` methods to return `Observable` instead of `Promise`
  ([PR #140](https://github.com/the-guild-org/apollo-angular/pull/140))
- Use types of options (for `watchQuery`, `query`, `mutate`) (
  [PR #145](https://github.com/the-guild-org/apollo-angular/pull/145),
  [PR #146](https://github.com/the-guild-org/apollo-angular/pull/146),
  [PR #148](https://github.com/the-guild-org/apollo-angular/pull/148) )

## v0.7.0

- Added support for **Ahead of Time** compilation
  ([PR #124](https://github.com/the-guild-org/apollo-angular/pull/124))

## v0.6.0

- Added support for ApolloClient `v0.5.X` ([PR #])
- Added `subscribeToMore` function ([PR](https://github.com/the-guild-org/apollo-client-rxjs/pull/5))
- **BREAKING CHANGE** No no longer support ApolloClient `v0.4.X`
- **BREAKING CHANGE** Removed `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** Removed `ApolloQueryPipe` (use `SelectPipe` instead)

## v0.5.0

- Added `subscribe` method to `Angular2Apollo` service
  ([PR #113](https://github.com/the-guild-org/apollo-angular/pull/113))
- Added `updateQuery` to `ApolloQueryObservable`
  ([PR #113](https://github.com/the-guild-org/apollo-angular/pull/113))
- **Deprecated** `ApolloQueryPipe` (use `SelectPipe` instead)
- **Deprecated** `Apollo` decorator (use `Angular2Apollo` service)
- **BREAKING CHANGE** No longer support for ApolloClient v0.3.X

## v0.4.6

- Moved to Angular 2 final and updated RxJS to the latest version
  ([PR #96](https://github.com/the-guild-org/apollo-angular/pull/96))

## v0.4.5

- Moved to Angular2 RC6 ([PR #81](https://github.com/the-guild-org/apollo-angular/pull/81))
- Added `fetchMore` to the `ApolloQuery` interface
  ([PR #82](https://github.com/the-guild-org/apollo-angular/pull/82))
  ([Issue #80](https://github.com/the-guild-org/apollo-angular/issues/80))

## v0.4.4

- Fixed format of arguments in backward compatible methods
  ([PR #74](https://github.com/the-guild-org/apollo-angular/pull/74))
- Made queries reusable (use refetch on new variables)
  ([PR #74](https://github.com/the-guild-org/apollo-angular/pull/74))
- Used [`apollo-client-rxjs`](https://github.com/the-guild-org/apollo-client-rxjs)
  ([PR #72](https://github.com/the-guild-org/apollo-angular/pull/72))
- Fixed an issue that prevents from subscribing to `ApolloQueryObservable`
  ([PR #71](https://github.com/the-guild-org/apollo-angular/pull/71))
- Added `SelectPipe` and deprecated `ApolloQueryPipe`
  ([PR #78](https://github.com/the-guild-org/apollo-angular/pull/78))

## v0.4.3

- Added `ApolloModule` (with RC5 of Angular2 comes NgModules)
  ([PR #63](https://github.com/the-guild-org/apollo-angular/pull/63))
- Added ability to use query variables as observables. With this, the query can be automatically
  re-run when those obserables emit new values.
  ([PR #64](https://github.com/the-guild-org/apollo-angular/pull/64))

## v0.4.2

- Added `fetchMore` support ([PR #58](https://github.com/the-guild-org/apollo-angular/pull/58))
- Exposed `ApolloQueryObservable` in the index module
  ([PR #54](https://github.com/the-guild-org/apollo-angular/pull/54))
- Added support for getting `loading` state from ApolloQueryResult
  [Issue #36](https://github.com/the-guild-org/apollo-angular/issues/36)
  ([PR #43](https://github.com/the-guild-org/apollo-angular/pull/43))
- Fixed `ApolloQueryObservable` incompatibility with `Rx.Observable`
  ([PR #59](https://github.com/the-guild-org/apollo-angular/pull/59))

## v0.4.1

- Added `ApolloQueryObservable` to support `Rx.Observable` in `Angular2Apollo.watchQuery` method
  ([PR #52](https://github.com/the-guild-org/apollo-angular/pull/52))
- Added `query` method to `Angular2Apollo` service
  ([PR #51](https://github.com/the-guild-org/apollo-angular/pull/51))

## v0.4.0

- Passing all the options of mutation in `Apollo` decorator
  [PR #39](https://github.com/the-guild-org/apollo-angular/pull/39)
- Added support for `apollo-client` breaking change that moves methods to query's observable
  ([PR #40](https://github.com/the-guild-org/apollo-angular/pull/40))
- Replaced `lodash` with subpackages, removed `graphql-tag` from dependencies, moved `apollo-client`
  and `@angular/core` to peerDependecies
  ([PR #44](https://github.com/the-guild-org/apollo-angular/pull/44))
- Added `ApolloQuery` interface ([PR #45](https://github.com/the-guild-org/apollo-angular/pull/45))

## v0.3.0

- Added SSR support
- Left `lodash` as the only one dependency and `@angular/core` with `apollo-client` as
  peerDependecies ([PR #29](https://github.com/the-guild-org/apollo-angular/pull/29))
- Fixed missing data in reused component
  ([PR #30](https://github.com/the-guild-org/apollo-angular/pull/30))
- Fixed overwriting query data with the same value on every poll interval
  ([PR #34](https://github.com/the-guild-org/apollo-angular/pull/34))

## v0.2.0

- Added polling, refetching and access to unsubscribe method
  ([PR #19](https://github.com/the-guild-org/apollo-angular/pull/19))
- Added `forceFetch`, `returnPartialData` and `pollInterval` support
  ([PR #19](https://github.com/the-guild-org/apollo-angular/pull/19))
- Added `errors` and `loading` to the query's result object
  ([PR #19](https://github.com/the-guild-org/apollo-angular/pull/19))
- Added both results from decorator and service support for `ApolloQueryPipe`
  ([PR #27](https://github.com/the-guild-org/apollo-angular/pull/27))
- Fixed issue with not setting a query with not defined variables
  ([PR #19](https://github.com/the-guild-org/apollo-angular/pull/19))

## v0.1.0

- Added Angular2 RC1 and ApolloClient 0.3.X support
  ([PR #16](https://github.com/the-guild-org/apollo-angular/pull/16),
  [PR #17](https://github.com/the-guild-org/apollo-angular/pull/17))

## v0.0.2

- Added `@Apollo` decorator
  ([99fed6e](https://github.com/the-guild-org/apollo-angular/commit/99fed6e),
  [9f0107e](https://github.com/the-guild-org/apollo-angular/commit/9f0107e))

## v0.0.1

Initial release. We didn't track changes before this version.
