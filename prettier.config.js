// prettier.config.js
/**
 * @type {import('prettier').Config}
 * @see https://www.prettier.cn/docs/options.html
 */
export default {
  trailingComma: 'all',
  singleQuote: true,
  semi: false,
  printWidth: 90,
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'],
  proseWrap: 'always',
  endOfLine: 'auto',
  experimentalTernaries: false,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'consistent',
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  vueIndentScriptAndStyle: false,
  singleAttributePerLine: false,
}
