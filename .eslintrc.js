module.exports = {
    env: {
      "jest/globals": true,
      node: true,
    },
    parser: "@typescript-eslint/parser",
    extends: [
      "eslint:recommended",
      "plugin:jest/recommended",
      "plugin:prettier/recommended",
    ],
    rules: {
      "no-console": "error",
    },
  };