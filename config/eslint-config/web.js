/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@rocketseat/eslint-config/next", "@gestor/prettier"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  }
};