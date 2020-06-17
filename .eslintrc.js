module.exports = {
  root: true,
  env: {
    node: true,
    // "jest/globals": true,
    "cypress/globals": true
  },
  plugins: [
    "cypress"
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:cypress/recommended",
    // "plugin:jest/recommended",
    "plugin:vue/recommended",
    "@vue/standard",
    "@vue/typescript"
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // "jest/no-disabled-tests": "warn",
    // "jest/no-focused-tests": "warn",
    // "jest/no-identical-title": "error",
    // "jest/prefer-to-have-length": "warn",
    // "jest/valid-expect": "error",
    "vue/name-property-casing": ["warn", "PascalCase"],
    "vue/component-name-in-template-casing": ["warn", "kebab-case"],
    "vue/no-unused-vars": 0,
    "vue/no-unused-components": "warn",
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "quotes": [ 0 ],
    "space-before-function-paren": 0,
    "keyword-spacing": 0,
    "no-console": 0,
    "padded-blocks": 0,
    "no-unused-vars": "warn",
    "no-trailing-spaces": "warn",
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/no-var-requires": 0,
    "array-bracket-spacing": 0,
    "comma-dangle": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "camelcase": 0
  }
}
