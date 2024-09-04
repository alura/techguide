"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirstMatcherArg = exports.findTopMostCallExpression = exports.createRule = exports.TestCaseName = exports.ModifierName = exports.HookName = exports.EqualityMatcher = exports.DescribeAlias = void 0;
exports.getNodeName = getNodeName;
exports.replaceAccessorFixer = exports.isFunction = exports.isBooleanLiteral = exports.hasOnlyOneArgument = exports.getTestCallExpressionsFromDeclaredVariables = void 0;

var _path = require("path");

var _utils = require("@typescript-eslint/utils");

var _package = require("../../../package.json");

var _accessors = require("./accessors");

var _followTypeAssertionChain = require("./followTypeAssertionChain");

var _parseJestFnCall = require("./parseJestFnCall");

const REPO_URL = 'https://github.com/jest-community/eslint-plugin-jest';

const createRule = _utils.ESLintUtils.RuleCreator(name => {
  const ruleName = (0, _path.parse)(name).name;
  return `${REPO_URL}/blob/v${_package.version}/docs/rules/${ruleName}.md`;
});
/**
 * Represents a `MemberExpression` with a "known" `property`.
 */


exports.createRule = createRule;

/**
 * Guards that the given `call` has only one `argument`.
 *
 * @param {CallExpression} call
 *
 * @return {call is CallExpressionWithSingleArgument}
 */
const hasOnlyOneArgument = call => call.arguments.length === 1;

exports.hasOnlyOneArgument = hasOnlyOneArgument;
let DescribeAlias;
exports.DescribeAlias = DescribeAlias;

(function (DescribeAlias) {
  DescribeAlias["describe"] = "describe";
  DescribeAlias["fdescribe"] = "fdescribe";
  DescribeAlias["xdescribe"] = "xdescribe";
})(DescribeAlias || (exports.DescribeAlias = DescribeAlias = {}));

let TestCaseName;
exports.TestCaseName = TestCaseName;

(function (TestCaseName) {
  TestCaseName["fit"] = "fit";
  TestCaseName["it"] = "it";
  TestCaseName["test"] = "test";
  TestCaseName["xit"] = "xit";
  TestCaseName["xtest"] = "xtest";
})(TestCaseName || (exports.TestCaseName = TestCaseName = {}));

let HookName;
exports.HookName = HookName;

(function (HookName) {
  HookName["beforeAll"] = "beforeAll";
  HookName["beforeEach"] = "beforeEach";
  HookName["afterAll"] = "afterAll";
  HookName["afterEach"] = "afterEach";
})(HookName || (exports.HookName = HookName = {}));

let ModifierName;
exports.ModifierName = ModifierName;

(function (ModifierName) {
  ModifierName["not"] = "not";
  ModifierName["rejects"] = "rejects";
  ModifierName["resolves"] = "resolves";
})(ModifierName || (exports.ModifierName = ModifierName = {}));

let EqualityMatcher;
exports.EqualityMatcher = EqualityMatcher;

(function (EqualityMatcher) {
  EqualityMatcher["toBe"] = "toBe";
  EqualityMatcher["toEqual"] = "toEqual";
  EqualityMatcher["toStrictEqual"] = "toStrictEqual";
})(EqualityMatcher || (exports.EqualityMatcher = EqualityMatcher = {}));

const joinNames = (a, b) => a && b ? `${a}.${b}` : null;

function getNodeName(node) {
  if ((0, _accessors.isSupportedAccessor)(node)) {
    return (0, _accessors.getAccessorValue)(node);
  }

  switch (node.type) {
    case _utils.AST_NODE_TYPES.TaggedTemplateExpression:
      return getNodeName(node.tag);

    case _utils.AST_NODE_TYPES.MemberExpression:
      return joinNames(getNodeName(node.object), getNodeName(node.property));

    case _utils.AST_NODE_TYPES.NewExpression:
    case _utils.AST_NODE_TYPES.CallExpression:
      return getNodeName(node.callee);
  }

  return null;
}

const isFunction = node => node.type === _utils.AST_NODE_TYPES.FunctionExpression || node.type === _utils.AST_NODE_TYPES.ArrowFunctionExpression;

exports.isFunction = isFunction;

const getTestCallExpressionsFromDeclaredVariables = (declaredVariables, context) => {
  return declaredVariables.reduce((acc, {
    references
  }) => acc.concat(references.map(({
    identifier
  }) => identifier.parent).filter(node => (node === null || node === void 0 ? void 0 : node.type) === _utils.AST_NODE_TYPES.CallExpression && (0, _parseJestFnCall.isTypeOfJestFnCall)(node, context, ['test']))), []);
};
/**
 * Replaces an accessor node with the given `text`, surrounding it in quotes if required.
 *
 * This ensures that fixes produce valid code when replacing both dot-based and
 * bracket-based property accessors.
 */


exports.getTestCallExpressionsFromDeclaredVariables = getTestCallExpressionsFromDeclaredVariables;

const replaceAccessorFixer = (fixer, node, text) => {
  return fixer.replaceText(node, node.type === _utils.AST_NODE_TYPES.Identifier ? text : `'${text}'`);
};

exports.replaceAccessorFixer = replaceAccessorFixer;

const findTopMostCallExpression = node => {
  let topMostCallExpression = node;
  let {
    parent
  } = node;

  while (parent) {
    if (parent.type === _utils.AST_NODE_TYPES.CallExpression) {
      topMostCallExpression = parent;
      parent = parent.parent;
      continue;
    }

    if (parent.type !== _utils.AST_NODE_TYPES.MemberExpression) {
      break;
    }

    parent = parent.parent;
  }

  return topMostCallExpression;
};

exports.findTopMostCallExpression = findTopMostCallExpression;

const isBooleanLiteral = node => node.type === _utils.AST_NODE_TYPES.Literal && typeof node.value === 'boolean';

exports.isBooleanLiteral = isBooleanLiteral;

const getFirstMatcherArg = expectFnCall => {
  const [firstArg] = expectFnCall.args;

  if (firstArg.type === _utils.AST_NODE_TYPES.SpreadElement) {
    return firstArg;
  }

  return (0, _followTypeAssertionChain.followTypeAssertionChain)(firstArg);
};

exports.getFirstMatcherArg = getFirstMatcherArg;