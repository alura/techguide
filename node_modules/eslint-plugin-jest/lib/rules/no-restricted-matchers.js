"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow specific matchers & modifiers',
      recommended: false
    },
    type: 'suggestion',
    schema: [{
      type: 'object',
      additionalProperties: {
        type: ['string', 'null']
      }
    }],
    messages: {
      restrictedChain: 'Use of `{{ chain }}` is disallowed',
      restrictedChainWithMessage: '{{ message }}'
    }
  },
  defaultOptions: [{}],

  create(context, [restrictedChains]) {
    return {
      CallExpression(node) {
        const jestFnCall = (0, _utils.parseJestFnCall)(node, context);

        if ((jestFnCall === null || jestFnCall === void 0 ? void 0 : jestFnCall.type) !== 'expect') {
          return;
        }

        const permutations = [jestFnCall.members];

        if (jestFnCall.members.length > 2) {
          permutations.push([jestFnCall.members[0], jestFnCall.members[1]]);
          permutations.push([jestFnCall.members[1], jestFnCall.members[2]]);
        }

        if (jestFnCall.members.length > 1) {
          permutations.push(...jestFnCall.members.map(nod => [nod]));
        }

        for (const permutation of permutations) {
          const chain = permutation.map(nod => (0, _utils.getAccessorValue)(nod)).join('.');

          if (chain in restrictedChains) {
            const message = restrictedChains[chain];
            context.report({
              messageId: message ? 'restrictedChainWithMessage' : 'restrictedChain',
              data: {
                message,
                chain
              },
              loc: {
                start: permutation[0].loc.start,
                end: permutation[permutation.length - 1].loc.end
              }
            });
            break;
          }
        }
      }

    };
  }

});

exports.default = _default;