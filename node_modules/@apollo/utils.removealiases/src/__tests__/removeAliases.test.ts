import gql from "graphql-tag";
import { removeAliases } from "..";

import graphQLASTSerializer from "@apollo/utils.jest-graphql-ast-serializer";
expect.addSnapshotSerializer(graphQLASTSerializer);

describe("removeAliases", () => {
  it("removes aliases from Field nodes", () => {
    expect(
      removeAliases(gql`
        query MyQuery {
          alias: field
          field
          fieldWithSelections {
            selection1
            selection2
          }
          aliasedSelections: fieldWithSelections {
            selection1
            selection2
          }
        }
      `),
    ).toMatchInlineSnapshot(`
      query MyQuery {
        field
        field
        fieldWithSelections {
          selection1
          selection2
        }
        fieldWithSelections {
          selection1
          selection2
        }
      }
    `);
  });
});
