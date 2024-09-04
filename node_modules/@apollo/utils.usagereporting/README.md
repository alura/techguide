# usageReporting

This package exports the useful bits of usage reporting related to signature computation and referenced field calculation.

## `usageReportingSignature`

In Apollo Studio, we want to group requests making the same query together, and treat different queries distinctly. But what does it mean for two queries to be "the same"? And what if you don't want to send the full text of the query to Apollo's servers, either because it contains sensitive data orw because it contains extraneous operations or fragments?

To solve these problems, Apollo Studio and related components have the concept of "signatures". We don't (by default) send the full query string of queries to Apollo's servers. Instead, each trace has its query string's "signature".

The `usageReportingSignature` function is a combination of the following transforms:

- `dropUnusedDefinitions`: removes operations and fragments that aren't going to be used in execution
- `stripSensitiveLiterals`: replaces all numeric and string literals as well as list and object input values with "empty" values
- `removeAliases`: removes field aliasing from the operation
- `sortAST`: sorts the children of most multi-child nodes consistently
- `printWithReducedWhitespace`, a variant on graphql-js's `print` which gets rid of unneeded whitespace

## `calculateReferencedFieldsByType`

Given a `DocumentNode` (operation) and a `GraphQLSchema`, `calculateReferencedFieldsByType` constructs a record of `typeName -> { fieldNames: string[], isInterface: boolean }`. This record _is_ the field usage data sent to Apollo Studio keyed by operation signature (`usageReportingSignature`).
