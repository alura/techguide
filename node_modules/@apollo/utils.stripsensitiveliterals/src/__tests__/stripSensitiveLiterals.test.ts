import gql from "graphql-tag";
import { stripSensitiveLiterals } from "..";

import graphQLASTSerializer from "@apollo/utils.jest-graphql-ast-serializer";

expect.addSnapshotSerializer(graphQLASTSerializer);

const document = gql`
  query Foo($b: Int, $a: Boolean) {
    user(
      name: "hello"
      age: 5
      pct: 0.4
      lst: ["a", "b", "c"]
      obj: { a: "a", b: 1 }
    ) {
      ...Bar
      ... on User {
        hello
        bee
      }
      tz
      aliased: name
      withInputs(
        str: "hi"
        int: 2
        flt: 0.3
        lst: ["", "", ""]
        obj: { q: "", s: 0 }
      )
    }
  }

  fragment Bar on User {
    age @skip(if: $a)
    ...Nested
  }

  fragment Nested on User {
    blah
  }
`;

describe("stripSensitiveLiterals", () => {
  it("strips only numeric and string literals with default configuration", () => {
    expect(stripSensitiveLiterals(document)).toMatchInlineSnapshot(`
      query Foo($b: Int, $a: Boolean) {
        user(name: "", age: 0, pct: 0, lst: ["", "", ""], obj: {a: "", b: 0}) {
          ...Bar
          ... on User {
            hello
            bee
          }
          tz
          aliased: name
          withInputs(str: "", int: 0, flt: 0, lst: ["", "", ""], obj: {q: "", s: 0})
        }
      }

      fragment Bar on User {
        age @skip(if: $a)
        ...Nested
      }

      fragment Nested on User {
        blah
      }
    `);
  });

  it("strips only numeric and string literals with empty (but defined) configuration", () => {
    expect(stripSensitiveLiterals(document, {})).toMatchInlineSnapshot(`
      query Foo($b: Int, $a: Boolean) {
        user(name: "", age: 0, pct: 0, lst: ["", "", ""], obj: {a: "", b: 0}) {
          ...Bar
          ... on User {
            hello
            bee
          }
          tz
          aliased: name
          withInputs(str: "", int: 0, flt: 0, lst: ["", "", ""], obj: {q: "", s: 0})
        }
      }

      fragment Bar on User {
        age @skip(if: $a)
        ...Nested
      }

      fragment Nested on User {
        blah
      }
    `);
  });

  it("strips only numeric and string literals with hideListAndObjectLiterals: false", () => {
    expect(
      stripSensitiveLiterals(document, { hideListAndObjectLiterals: false }),
    ).toMatchInlineSnapshot(`
      query Foo($b: Int, $a: Boolean) {
        user(name: "", age: 0, pct: 0, lst: ["", "", ""], obj: {a: "", b: 0}) {
          ...Bar
          ... on User {
            hello
            bee
          }
          tz
          aliased: name
          withInputs(str: "", int: 0, flt: 0, lst: ["", "", ""], obj: {q: "", s: 0})
        }
      }

      fragment Bar on User {
        age @skip(if: $a)
        ...Nested
      }

      fragment Nested on User {
        blah
      }
    `);
  });

  it("strips all literals with hideListAndObjectLiterals: true", () => {
    expect(
      stripSensitiveLiterals(document, { hideListAndObjectLiterals: true }),
    ).toMatchInlineSnapshot(`
      query Foo($b: Int, $a: Boolean) {
        user(name: "", age: 0, pct: 0, lst: [], obj: {}) {
          ...Bar
          ... on User {
            hello
            bee
          }
          tz
          aliased: name
          withInputs(str: "", int: 0, flt: 0, lst: [], obj: {})
        }
      }

      fragment Bar on User {
        age @skip(if: $a)
        ...Nested
      }

      fragment Nested on User {
        blah
      }
    `);
  });
});
