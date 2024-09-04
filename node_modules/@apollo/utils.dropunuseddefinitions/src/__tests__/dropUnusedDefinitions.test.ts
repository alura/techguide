import { print, parse } from "graphql";
import { dropUnusedDefinitions } from "..";

describe("dropUnusedDefinitions", () => {
  it("anonymous operation", () => {
    const operation = parse(`#graphql
      {abc}
    `);
    expect(print(dropUnusedDefinitions(operation, ""))).toMatchInlineSnapshot(`
      "{
        abc
      }"
    `);
  });

  it("named operation", () => {
    const operation = parse(`#graphql
      query MyQuery {abc}
    `);
    expect(print(dropUnusedDefinitions(operation, "MyQuery")))
      .toMatchInlineSnapshot(`
      "query MyQuery {
        abc
      }"
    `);
  });

  it("multiple operations", () => {
    const operation = parse(`#graphql
      query Keep { abc }
      query Drop { def }
    `);
    expect(print(dropUnusedDefinitions(operation, "Keep")))
      .toMatchInlineSnapshot(`
      "query Keep {
        abc
      }"
    `);
  });

  it("includes only used fragments", () => {
    const operation = parse(`#graphql
      query Drop { ...DroppedFragment }
      fragment DroppedFragment on Query { abc }
      query Keep { ...KeptFragment }
      fragment KeptFragment on Query { def }
    `);
    expect(print(dropUnusedDefinitions(operation, "Keep")))
      .toMatchInlineSnapshot(`
      "query Keep {
        ...KeptFragment
      }

      fragment KeptFragment on Query {
        def
      }"
    `);
  });

  it("preserves entire document when operation isn't found", () => {
    const operation = parse(`#graphql
      query Keep { ...KeptFragment }
      fragment KeptFragment on Query { abc }
      query AlsoKeep { ...AlsoKeptFragment }
      fragment AlsoKeptFragment on Query { def }
    `);
    expect(print(dropUnusedDefinitions(operation, "Unknown")))
      .toMatchInlineSnapshot(`
      "query Keep {
        ...KeptFragment
      }

      fragment KeptFragment on Query {
        abc
      }

      query AlsoKeep {
        ...AlsoKeptFragment
      }

      fragment AlsoKeptFragment on Query {
        def
      }"
    `);
  });
});
