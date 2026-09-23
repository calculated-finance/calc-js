const path = require('path');

const namespaceMapping = path.resolve(__dirname, '../rujira.ui/namespaceMapping.cjs');

const i18nRule = (namespace) => ({
  'i18next-no-undefined-translation-keys/no-undefined-translation-keys': [
    'warn',
    {
      namespaceTranslationMappingFile: namespaceMapping,
      defaultNamespace: namespace
    }
  ]
});

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['i18next-no-undefined-translation-keys'],
  rules: {
    'i18next-no-undefined-translation-keys/translation-key-string-literal': 'warn'
  },
  overrides: [
    { files: ['src/algorithmic/**/*.ts', 'src/algorithmic/**/*.tsx'], rules: i18nRule('algorithmic') },
    { files: ['src/swap/**/*.ts', 'src/swap/**/*.tsx'], rules: i18nRule('swap') },
    { files: ['src/trade/**/*.ts', 'src/trade/**/*.tsx'], rules: i18nRule('trade') },
    { files: ['src/borrow/**/*.ts', 'src/borrow/**/*.tsx'], rules: i18nRule('borrow') },
    { files: ['src/portfolio/**/*.ts', 'src/portfolio/**/*.tsx'], rules: i18nRule('portfolio') },
    { files: ['src/strategies/**/*.ts', 'src/strategies/**/*.tsx'], rules: i18nRule('strategies') },
    { files: ['src/leagues/**/*.ts', 'src/leagues/**/*.tsx'], rules: i18nRule('leagues') },
    { files: ['src/merge/**/*.ts', 'src/merge/**/*.tsx'], rules: i18nRule('merge') },
    { files: ['src/home/**/*.ts', 'src/home/**/*.tsx'], rules: i18nRule('home') },
    { files: ['src/ecosystem/**/*.ts', 'src/ecosystem/**/*.tsx'], rules: i18nRule('ecosystem') },
    { files: ['src/index/**/*.ts', 'src/index/**/*.tsx'], rules: i18nRule('index') },
    { files: ['src/developer/**/*.ts', 'src/developer/**/*.tsx'], rules: i18nRule('developer') },
    { files: ['src/tor/**/*.ts', 'src/tor/**/*.tsx'], rules: i18nRule('tor') },
    { files: ['src/common/**/*.ts', 'src/common/**/*.tsx'], rules: i18nRule('common') },
    { files: ['src/staking/**/*.ts', 'src/staking/**/*.tsx'], rules: i18nRule('staking') },
  ]
}
