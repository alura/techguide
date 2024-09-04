import gql from "graphql-tag";
import { printWithReducedWhitespace } from "..";

describe("printWithReducedWhitespace", () => {
  const cases = [
    {
      name: "lots of whitespace",
      // Note: there's a tab after "tab->", which prettier wants to keep as a
      // literal tab rather than \t.  In the output, there should be a literal
      // backslash-t.
      input: gql`
        query Foo($a: Int) {
          user(
            name: "   tab->	yay"
            other: """
            apple
               bag
            cat
            """
          ) {
            name
          }
        }
      `,
      output:
        'query Foo($a:Int){user(name:"   tab->\\tyay"other:"apple\\n   bag\\ncat"){name}}',
    },
  ];
  cases.forEach(({ name, input, output }) => {
    test(name, () => {
      expect(printWithReducedWhitespace(input)).toEqual(output);
    });
  });
});
