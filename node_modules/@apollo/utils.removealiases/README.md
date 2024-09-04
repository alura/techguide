# removeAliases

The `removeAliases` function is a `graphql-js` visitor which removes aliases from all `Field` nodes. Note that this function makes no guarantees about the output being a valid GraphQL operation.

For example, the following operation is no longer valid once the alias is removed since the fields can't be merged:

```graphql
query {
  x(a: 1)
  alias: x(a: 2)
}
```
