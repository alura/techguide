module.exports = {
  ignorePatterns: ["_api/gql_types.ts", "src/gql_types.ts"],
  env: {
    "jest/globals": true,
    node: true,
  },
  globals: {
    document: true,
    globalThis: true,
    window: true,
    JSX: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@next/next/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": "error",
    "@next/next/no-html-link-for-pages": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
