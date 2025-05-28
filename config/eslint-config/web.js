/** @type {import("eslint").Linter.Config} */
module.exports = [
  {
    // Como estamos usando "extends", necesitamos usar el utilitario de compatibilidad
    // Ver: https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "simple-import-sort": require("eslint-plugin-simple-import-sort"),
      "react-refresh": require("eslint-plugin-react-refresh"),
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin")
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ]
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    ignores: [
      "dist/**",
      ".turbo/**",
      "node_modules/**",
      "public/**"
    ]
  }
];