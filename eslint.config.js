import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

// NodeJS targetted
const bundlerScriptsConfig = {
  files: [".neko-ssg/**/*.js"],
  languageOptions: {
    globals: globals.nodeBuiltin,
  },
};

// Browser targetted
const srcScriptsConfig = {
  files: ["src/**/*.js"],
  languageOptions: {
    globals: globals.browser,
  },
};

export default [
  jsdoc.configs["flat/recommended"],
  {
    files: ["**/*.js"],
    ignores: ["build/*", "static/*"],
    rules: {
      "jsdoc/require-description": "warn",
    },
  },
  bundlerScriptsConfig,
  srcScriptsConfig,
  // Any other config should be placed at the top
  eslintConfigPrettier,
];
