"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("@typescript-eslint/utils");

var _utils2 = require("./utils");

var _default = (0, _utils2.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforces a maximum depth to nested describe calls',
      recommended: false
    },
    messages: {
      exceededMaxDepth: 'Too many nested describe calls ({{ depth }}). Maximum allowed is {{ max }}.'
    },
    type: 'suggestion',
    schema: [{
      type: 'object',
      properties: {
        max: {
          type: 'integer',
          minimum: 0
        }
      },
      additionalProperties: false
    }]
  },
  defaultOptions: [{
    max: 5
  }],

  create(context, [{
    max
  }]) {
    const describeCallbackStack = [];

    function pushDescribeCallback(node) {
      const {
        parent
      } = node;

      if ((parent === null || parent === void 0 ? void 0 : parent.type) !== _utils.AST_NODE_TYPES.CallExpression || !(0, _utils2.isTypeOfJestFnCall)(parent, context, ['describe'])) {
        return;
      }

      describeCallbackStack.push(0);

      if (describeCallbackStack.length > max) {
        context.report({
          node: parent,
          messageId: 'exceededMaxDepth',
          data: {
            depth: describeCallbackStack.length,
            max
          }
        });
      }
    }

    function popDescribeCallback(node) {
      const {
        parent
      } = node;

      if ((parent === null || parent === void 0 ? void 0 : parent.type) === _utils.AST_NODE_TYPES.CallExpression && (0, _utils2.isTypeOfJestFnCall)(parent, context, ['describe'])) {
        describeCallbackStack.pop();
      }
    }

    return {
      FunctionExpression: pushDescribeCallback,
      'FunctionExpression:exit': popDescribeCallback,
      ArrowFunctionExpression: pushDescribeCallback,
      'ArrowFunctionExpression:exit': popDescribeCallback
    };
  }

});

exports.default = _default;