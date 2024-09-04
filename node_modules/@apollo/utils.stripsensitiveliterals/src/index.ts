import type {
  ASTVisitor,
  DocumentNode,
  FloatValueNode,
  IntValueNode,
  ListValueNode,
  ObjectValueNode,
  StringValueNode,
} from "graphql";
import { visit } from "graphql";

// Hide sensitive string and numeric literals. Optionally hide list and object literals with the option `hideListAndObjectLiterals: true`.
export function stripSensitiveLiterals(
  ast: DocumentNode,
  options: { hideListAndObjectLiterals?: boolean } = {
    hideListAndObjectLiterals: false,
  },
): DocumentNode {
  const listAndObjectVisitorIfEnabled: ASTVisitor =
    options.hideListAndObjectLiterals
      ? {
          ListValue(node: ListValueNode): ListValueNode {
            return { ...node, values: [] };
          },
          ObjectValue(node: ObjectValueNode): ObjectValueNode {
            return { ...node, fields: [] };
          },
        }
      : {};

  return visit(ast, {
    IntValue(node): IntValueNode {
      return { ...node, value: "0" };
    },
    FloatValue(node): FloatValueNode {
      return { ...node, value: "0" };
    },
    StringValue(node): StringValueNode {
      return { ...node, value: "", block: false };
    },
    ...listAndObjectVisitorIfEnabled,
  });
}
