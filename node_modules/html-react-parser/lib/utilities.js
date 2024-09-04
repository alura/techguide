var React = require('react');
var styleToJS = require('style-to-js').default;

/**
 * Swap key with value in an object.
 *
 * @param {object} obj - The object.
 * @param {Function} [override] - The override method.
 * @returns - The inverted object.
 */
function invertObject(obj, override) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('First argument must be an object');
  }

  var key;
  var value;
  var isOverridePresent = typeof override === 'function';
  var overrides = {};
  var result = {};

  for (key in obj) {
    value = obj[key];

    if (isOverridePresent) {
      overrides = override(key, value);
      if (overrides && overrides.length === 2) {
        result[overrides[0]] = overrides[1];
        continue;
      }
    }

    if (typeof value === 'string') {
      result[value] = key;
    }
  }

  return result;
}

/**
 * Check if a given tag is a custom component.
 *
 * @see {@link https://github.com/facebook/react/blob/v16.6.3/packages/react-dom/src/shared/isCustomComponent.js}
 *
 * @param {string} tagName - The name of the html tag.
 * @param {object} props - The props being passed to the element.
 * @returns - Whether tag is custom component.
 */
function isCustomComponent(tagName, props) {
  if (tagName.indexOf('-') === -1) {
    return props && typeof props.is === 'string';
  }

  switch (tagName) {
    // These are reserved SVG and MathML elements.
    // We don't mind this whitelist too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return false;
    default:
      return true;
  }
}

var styleToJSOptions = { reactCompat: true };

/**
 * Sets style prop.
 *
 * @param {null|undefined|string} style
 * @param {object} props
 */
function setStyleProp(style, props) {
  if (style === null || style === undefined) {
    return;
  }
  try {
    props.style = styleToJS(style, styleToJSOptions);
  } catch (err) {
    props.style = {};
  }
}

/**
 * @constant {boolean}
 * @see {@link https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html}
 */
var PRESERVE_CUSTOM_ATTRIBUTES = React.version.split('.')[0] >= 16;

// Taken from
// https://github.com/facebook/react/blob/cae635054e17a6f107a39d328649137b83f25972/packages/react-dom/src/client/validateDOMNesting.js#L213
var elementsWithNoTextChildren = new Set([
  'tr',
  'tbody',
  'thead',
  'tfoot',
  'colgroup',
  'table',
  'head',
  'html',
  'frameset'
]);

/**
 * Checks if the given node can contain text nodes
 *
 * @param {DomElement} node - Node.
 * @returns - Whether node can contain text nodes.
 */
function canTextBeChildOfNode(node) {
  return !elementsWithNoTextChildren.has(node.name);
}

module.exports = {
  PRESERVE_CUSTOM_ATTRIBUTES: PRESERVE_CUSTOM_ATTRIBUTES,
  invertObject: invertObject,
  isCustomComponent: isCustomComponent,
  setStyleProp: setStyleProp,
  canTextBeChildOfNode: canTextBeChildOfNode,
  elementsWithNoTextChildren: elementsWithNoTextChildren
};
