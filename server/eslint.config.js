import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'linebreak-style': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'arrow-parens': ['error', 'as-needed'],
      'object-property-newline': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      'object-curly-newline': ['error', { consistent: true }],
      'no-param-reassign': 'off',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'consistent-return': 'off',
      '@typescript-eslint/camelcase': 'off',
      'lines-between-class-members': 'off',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
