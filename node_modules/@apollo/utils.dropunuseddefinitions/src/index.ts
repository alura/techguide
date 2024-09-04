import { DocumentNode, separateOperations } from "graphql";

// A GraphQL query may contain multiple named operations, with the operation to
// use specified separately by the client. This transformation drops unused
// operations from the query, as well as any fragment definitions that are not
// referenced.  (In general we recommend that unused definitions are dropped on
// the client before sending to the server to save bandwidth and parsing time.)
export function dropUnusedDefinitions(
  ast: DocumentNode,
  operationName: string,
): DocumentNode {
  const separated = separateOperations(ast)[operationName];
  if (!separated) {
    // If the given operationName isn't found, just make this whole transform a
    // no-op instead of crashing.
    return ast;
  }
  return separated;
}
