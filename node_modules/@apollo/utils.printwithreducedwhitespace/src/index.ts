import { visit, print, DocumentNode, StringValueNode } from "graphql";
// Like the graphql-js print function, but deleting whitespace wherever
// feasible. Specifically, all whitespace (outside of string literals) is
// reduced to at most one space, and even that space is removed anywhere except
// for between two alphanumerics.
export function printWithReducedWhitespace(ast: DocumentNode): string {
  // In a GraphQL AST (which notably does not contain comments), the only place
  // where meaningful whitespace (or double quotes) can exist is in
  // StringNodes. So to print with reduced whitespace, we:
  // - temporarily sanitize strings by replacing their contents with hex
  // - use the default GraphQL printer
  // - minimize the whitespace with a simple regexp replacement
  // - convert strings back to their actual value
  // We normalize all strings to non-block strings for simplicity.

  const sanitizedAST = visit(ast, {
    StringValue(node: StringValueNode): StringValueNode {
      return {
        ...node,
        value: Buffer.from(node.value, "utf8").toString("hex"),
        block: false,
      };
    },
  });
  const withWhitespace = print(sanitizedAST);
  const minimizedButStillHex = withWhitespace
    .replace(/\s+/g, " ")
    .replace(/([^_a-zA-Z0-9]) /g, (_, c) => c)
    .replace(/ ([^_a-zA-Z0-9])/g, (_, c) => c);
  return minimizedButStillHex.replace(/"([a-f0-9]+)"/g, (_, hex) =>
    JSON.stringify(Buffer.from(hex, "hex").toString("utf8")),
  );
}
