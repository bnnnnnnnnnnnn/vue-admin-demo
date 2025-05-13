import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  yaml: true,
  markdown: true,
}, {
  files: ['**/*.vue', '**/*.ts'],
  rules: {
    'no-with': 'off',
    'unused-imports/no-unused-vars': ['error', {
      caughtErrors: 'none',
      argsIgnorePattern: '^_',
    }],
    'unused-imports/no-unused-imports': 'error',
    'import/no-duplicates': ['error', { 'prefer-inline': false, 'considerQueryString': true }],
  },
})
