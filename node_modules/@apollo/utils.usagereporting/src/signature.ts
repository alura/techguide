// In Apollo Studio, we want to group requests making the same query together,
// and treat different queries distinctly. But what does it mean for two queries
// to be "the same"?  And what if you don't want to send the full text of the
// query to Apollo's servers, either because it contains sensitive data or
// because it contains extraneous operations or fragments?
//
// To solve these problems, Apollo Studio and related components have the
// concept of "signatures". We don't (by default) send the full query string of
// queries to Apollo's servers. Instead, each trace has its query string's
// "signature".
//
// This module combines several AST transformations to create its signature:
//
// - dropUnusedDefinitions, which removes operations and fragments that aren't
//   going to be used in execution
// - stripSensitiveLiterals, which replaces all numeric and string literals as
//   well as list and object input values with "empty" values
// - removeAliases, which removes field aliasing from the query
// - sortAST, which sorts the children of most multi-child nodes consistently
// - printWithReducedWhitespace, a variant on graphql-js's 'print' which gets
//   rid of unneeded whitespace
import { dropUnusedDefinitions } from "@apollo/utils.dropunuseddefinitions";
import { stripSensitiveLiterals } from "@apollo/utils.stripsensitiveliterals";
import { printWithReducedWhitespace } from "@apollo/utils.printwithreducedwhitespace";
import { removeAliases } from "@apollo/utils.removealiases";
import { sortAST } from "@apollo/utils.sortast";
import type { DocumentNode } from "graphql";

export function usageReportingSignature(
  ast: DocumentNode,
  operationName: string,
): string {
  return printWithReducedWhitespace(
    sortAST(
      removeAliases(
        stripSensitiveLiterals(dropUnusedDefinitions(ast, operationName), {
          hideListAndObjectLiterals: true,
        }),
      ),
    ),
  );
}
