import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default {
  extends: ['stylelint-config-recommended'],
  plugins: [
    'stylelint-declaration-strict-value',
    'stylelint-value-no-unknown-custom-properties'
  ],
  rules: {
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'csstools/value-no-unknown-custom-properties': [true, {
      importFrom: [join(root, 'src', 'index.css')]
    }],
    'scale-unlimited/declaration-strict-value': [
      ['font-size', '/^padding/', '/^margin/', '/gap$/'],
      {
        ignoreValues: ['0', 'auto', 'inherit', 'initial', 'normal', 'unset', '62.5%', '100%']
      }
    ]
  }
};
