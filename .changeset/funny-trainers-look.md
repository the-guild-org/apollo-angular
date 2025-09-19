---
'apollo-angular': major
---

`httpHeaders` is a class

Migrate your code like so:

```diff
- const link = httpHeaders();
+ const link = new HttpHeadersLink();
```
