const { matcherTest, buildReturnMessage } = require('../utils');

function toHaveStyleRule({ props: {style} }, property, expected) {
  const styles = Array.isArray(style) ? style.filter(x => x) : style

  /**
   * Convert style name to camel case (so we can compare)
   */
  const camelCasedProperty = property.replace(/-(\w)/, (_, match) => match.toUpperCase());

  /**
   * Merge all styles into one final style object and search for the desired
   * stylename against this object
   */
  const mergedStyles =
    Array.isArray(styles)
      ? styles.reduce((acc, item) => (Object.assign({}, acc, item)), {})
      : styles
  const received = mergedStyles[camelCasedProperty];
  const pass = matcherTest(received, expected, this.isNot);

  return {
    pass,
    message: buildReturnMessage(this.utils, pass, property, received, expected),
  };
}

module.exports = toHaveStyleRule;
