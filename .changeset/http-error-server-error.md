---
'apollo-angular': major
---

**BREAKING CHANGE**: HTTP errors now return Apollo Client's `ServerError` instead of Angular's `HttpErrorResponse`

When Apollo Server returns non-2xx HTTP status codes (status >= 300), apollo-angular's HTTP links now return `ServerError` from `@apollo/client/errors` instead of Angular's `HttpErrorResponse`. This enables proper error detection in errorLinks using `ServerError.is(error)` and provides consistent error handling with Apollo Client's ecosystem.

**Migration Guide:**

Before:
```typescript
import { HttpErrorResponse } from '@angular/common/http';

link.request(operation).subscribe({
  error: (err) => {
    if (err instanceof HttpErrorResponse) {
      console.log(err.status);
      console.log(err.error);
    }
  }
});
```

After:
```typescript
import { ServerError } from '@apollo/client/errors';

link.request(operation).subscribe({
  error: (err) => {
    if (ServerError.is(err)) {
      console.log(err.statusCode);
      console.log(err.bodyText);
      console.log(err.response.headers);
    }
  }
});
```

**Properties Changed:**
- `err.status` → `err.statusCode`
- `err.error` → `err.bodyText` (always string, JSON stringified for objects)
- `err.headers` (Angular HttpHeaders) → `err.response.headers` (native Headers)
- Access response via `err.response` which includes: `status`, `statusText`, `ok`, `url`, `type`, `redirected`

**Note:** This only affects HTTP-level errors (status >= 300). Network errors and other error types remain unchanged. GraphQL errors in the response body are still processed normally through Apollo Client's error handling.

Fixes #2394
