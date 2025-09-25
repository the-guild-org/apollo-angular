---
'apollo-angular': major
---

Combined parameters of `Query`, `Mutation` and `Subscription` classes generated via codegen

Migrate your code like so:

```diff
class MyComponent {
  myQuery = inject(MyQuery);
  myMutation = inject(MyMutation);
  mySubscription = inject(MySubscription);

  constructor() {
-    myQuery.watch({ myVariable: 'foo' }, { fetchPolicy: 'cache-and-network' });
+    myQuery.watch({ variables: { myVariable: 'foo' }, fetchPolicy: 'cache-and-network' })    

-    myMutation.mutate({ myVariable: 'foo' }, { errorPolicy: 'ignore' });
+    myMutation.mutate({ variables: { myVariable: 'foo' }, errorPolicy: 'ignore' }); 

-    mySubscription.subscribe({ myVariable: 'foo' }, { fetchPolicy: 'network-only' });
+    mySubscription.subscribe({ variables: { myVariable: 'foo' }, fetchPolicy: 'network-only' });
  }
}
```
