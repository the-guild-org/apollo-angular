---
'apollo-angular': major
---

Namespaced types

Before:

```ts
import type {
  Options,
  BatchOptions
} from 'apollo-angular/http';

import type {
  MutationOptionsAlone,
  QueryOptionsAlone,
  SubscriptionOptionsAlone,
  WatchQueryOptions,
  WatchQueryOptionsAlone,
} from 'apollo-angular';

type AllTypes =
  | Options
  | BatchOptions
  | MutationOptionsAlone
  | QueryOptionsAlone
  | SubscriptionOptionsAlone
  | WatchQueryOptions
  | WatchQueryOptionsAlone;
```

After:

```ts
import type {
  HttpBatchLink,
  HttpLink
} from 'apollo-angular/http';

import type {
  Apollo,
  Mutation,
  Query,
  Subscription,
} from 'apollo-angular';

type AllTypes =
  | HttpLink.Options
  | HttpBatchLink.Options
  | Mutation.MutateOptions
  | Query.FetchOptions
  | Subscription.SubscribeOptions
  | Apollo.WatchQueryOptions
  | Query.WatchOptions;
```
