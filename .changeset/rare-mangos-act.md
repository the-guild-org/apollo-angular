---
'apollo-angular': patch
---

Rename `onlyComplete()` into `onlyCompleteData()`

Because it communicates better that it is about the data, and not the
stream being completed.

`onlyComplete()` will be dropped in the next major version.
