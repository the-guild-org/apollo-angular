---
'apollo-angular': minor
---

New `onlyComplete()` helper to filter only complete results

If you use this, you should probably combine it with [`notifyOnNetworkStatusChange`](https://www.apollographql.com/docs/react/data/queries#queryhookoptions-interface-notifyonnetworkstatuschange).
This tells `@apollo/client` to not emit the first `partial` result, so
`apollo-angular` does not need to filter it out. The overall behavior is
identical, but it saves some CPU cycles.

So something like this:

```ts
apollo
  .watchQuery({
    query: myQuery,
    notifyOnNetworkStatusChange: false, // Adding this will save CPU cycles
  })
  .valueChanges
  .pipe(onlyComplete())
  .subscribe(result => {
    // Do something with complete result
  });
```
