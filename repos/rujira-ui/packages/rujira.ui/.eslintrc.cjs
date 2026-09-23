module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['i18next-no-undefined-translation-keys'],
  rules: {
    'i18next-no-undefined-translation-keys/translation-key-string-literal': 'warn',
    'i18next-no-undefined-translation-keys/no-undefined-translation-keys': [
      'warn',
      {
        namespaceTranslationMappingFile: __dirname + '/namespaceMapping.cjs'
      }
    ]
  }
}
