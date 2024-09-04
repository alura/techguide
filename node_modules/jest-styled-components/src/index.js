const toHaveStyleRule = require('./toHaveStyleRule');
const styleSheetSerializer = require('./styleSheetSerializer');
const { resetStyleSheet } = require('./utils');

global.beforeEach(resetStyleSheet);

expect.addSnapshotSerializer(styleSheetSerializer);
expect.extend({ toHaveStyleRule });

module.exports = {
  styleSheetSerializer,
};
