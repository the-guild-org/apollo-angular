---
'apollo-angular': major
---

Move `useZone` option into subscription options


```diff
- const obs = apollo.subscribe(options, { useZone: false });
+ const obs = apollo.subscribe({ ...options, useZone: false });
```
