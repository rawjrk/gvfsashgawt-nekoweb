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
  {
    ignores: ["build/*", "static/*"],
  },
  jsdoc.configs["flat/recommended"],
  bundlerScriptsConfig,
  srcScriptsConfig,
  // Any other config should be placed at the top
  eslintConfigPrettier,
];
