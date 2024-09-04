const css = require('@adobe/css-tools');
const { getCSS, getHashes } = require('./utils');

let cache = new WeakSet();
const getNodes = (node, nodes = []) => {
  if (typeof node === 'object') {
    nodes.push(node);
  }

  if (node.children) {
    Array.from(node.children).forEach((child) => getNodes(child, nodes));
  }

  return nodes;
};

const getClassNamesFromDOM = (node) => Array.from(node.classList);
const getClassNamesFromProps = (node) => {
  const classNameProp = node.props && (node.props.class || node.props.className);

  if (classNameProp) {
    return classNameProp.trim().split(/\s+/);
  }

  return [];
};

const getClassNames = (nodes) =>
  nodes.reduce((classNames, node) => {
    let newClassNames = null;

    if (global.Element && node instanceof global.Element) {
      newClassNames = getClassNamesFromDOM(node);
    } else {
      newClassNames = getClassNamesFromProps(node);
    }

    newClassNames.forEach((className) => classNames.add(className));

    return classNames;
  }, new Set());

const isStyledClass = (className) => /^\.?(\w+(-|_))?sc-/.test(className);

const filterClassNames = (classNames, hashes) => classNames.filter((className) => hashes.includes(className));
const filterUnreferencedClassNames = (classNames, hashes) =>
  classNames.filter((className) => isStyledClass(className) && !hashes.includes(className));

const includesClassNames = (classNames, selectors) =>
  classNames.some((className) => selectors.some((selector) => selector.includes(className)));

const includesUnknownClassNames = (classNames, selectors) =>
  !selectors
    .flatMap((selector) => selector.split(' '))
    .filter((chunk) => isStyledClass(chunk))
    .every((chunk) => classNames.some((className) => chunk.includes(className)));

const filterRules = (classNames) => (rule) =>
  rule.type === 'rule' &&
  !includesUnknownClassNames(classNames, rule.selectors) &&
  includesClassNames(classNames, rule.selectors) &&
  rule.declarations.length;

const getAtRules = (ast, filter) =>
  ast.stylesheet.rules
    .filter((rule) => rule.type === 'media' || rule.type === 'supports')
    .reduce((acc, atRule) => {
      atRule.rules = atRule.rules.filter(filter);

      return acc.concat(atRule);
    }, []);

const getStyle = (classNames, config = {}) => {
  const ast = getCSS();
  const filter = filterRules(classNames);
  const rules = ast.stylesheet.rules.filter(filter);
  const atRules = getAtRules(ast, filter);

  ast.stylesheet.rules = rules.concat(atRules);

  return css.stringify(ast, { indent: config.indent });
};

const getClassNamesFromSelectorsByHashes = (classNames, hashes) => {
  const ast = getCSS();
  const filter = filterRules(classNames);
  const rules = ast.stylesheet.rules.filter(filter);

  const selectors = rules.map((rule) => rule.selectors);
  const classNamesIncludingFromSelectors = new Set(classNames);
  const addHashFromSelectorListToClassNames = (hash) =>
    selectors.forEach((selectorList) => selectorList[0].includes(hash) && classNamesIncludingFromSelectors.add(hash));

  hashes.forEach(addHashFromSelectorListToClassNames);

  return [...classNamesIncludingFromSelectors];
};

const replaceClassNames = (result, classNames, style, classNameFormatter) =>
  classNames
    .filter((className) => style.includes(className))
    .reduce((acc, className, index) => acc.replace(new RegExp(className, 'g'), classNameFormatter(index++)), result);

const stripUnreferencedClassNames = (result, classNames) =>
  classNames.reduce((acc, className) => acc.replace(new RegExp(`${className}\\s?`, 'g'), ''), result);

const replaceHashes = (result, hashes) =>
  hashes.reduce(
    (acc, className) => acc.replace(new RegExp(`((class|className)="[^"]*?)${className}\\s?([^"]*")`, 'g'), '$1$3'),
    result
  );

const serializerOptionDefaults = {
  addStyles: true,
  classNameFormatter: (index) => `c${index}`,
};
let serializerOptions = serializerOptionDefaults;

module.exports = {
  /**
   * Configure jest-styled-components/serializer
   *
   * @param {{ addStyles?: boolean, classNameFormatter?: (index: number) => string }} options
   */
  setStyleSheetSerializerOptions(options = {}) {
    serializerOptions = {
      ...serializerOptionDefaults,
      ...options,
    };
  },

  test(val) {
    return (
      val &&
      !cache.has(val) &&
      (val.$$typeof === Symbol.for('react.test.json') || (global.Element && val instanceof global.Element))
    );
  },

  serialize(val, config, indentation, depth, refs, printer) {
    const nodes = getNodes(val);
    nodes.forEach(cache.add, cache);

    const hashes = getHashes();

    let classNames = [...getClassNames(nodes)];
    let unreferencedClassNames = classNames;

    classNames = filterClassNames(classNames, hashes);
    unreferencedClassNames = filterUnreferencedClassNames(unreferencedClassNames, hashes);

    const style = getStyle(classNames, config);
    const classNamesToReplace = getClassNamesFromSelectorsByHashes(classNames, hashes);
    const code = printer(val, config, indentation, depth, refs);

    let result = serializerOptions.addStyles ? `${style}${style ? '\n\n' : ''}${code}` : code;
    result = stripUnreferencedClassNames(result, unreferencedClassNames);
    result = replaceClassNames(result, classNamesToReplace, style, serializerOptions.classNameFormatter);
    result = replaceHashes(result, hashes);
    nodes.forEach(cache.delete, cache);
    return result;
  },
};
