module.exports = {
  ignorePatterns: ["api/gql_types.ts"],
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
