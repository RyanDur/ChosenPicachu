import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default {
  overrides: [{files: ['src/styles/surface.css'], rules: {'property-disallowed-list': null}}],
  extends: ['stylelint-config-recommended'],
  plugins: [
    'stylelint-declaration-strict-value',
    'stylelint-value-no-unknown-custom-properties'
  ],
  rules: {
    'selector-disallowed-list': [
      ['/(^|[\\s>+~,])(applet|acronym|big|blink|center|font|marquee|strike|tt)(?![\\w-])/'],
      {message: 'obsolete element — this is a strict html5 site'}
    ],
    'media-feature-range-notation': 'context',
    'property-disallowed-list': [
      ['/^overscroll-behavior/'],
      {message: 'a scroller that keeps the swipe wears contained; the declaration lives in the vocabulary'}
    ],
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'csstools/value-no-unknown-custom-properties': [true, {
      importFrom: [
        join(root, 'src', 'styles', 'colors.css'),
        join(root, 'src', 'styles', 'spacing.css'),
        join(root, 'src', 'styles', 'typography.css')
      ]
    }],
    'scale-unlimited/declaration-strict-value': [
      [
        'font-size', '/^padding/', '/^margin/', '/gap$/',
        'color', '/-color$/', 'fill', 'stroke', 'background', 'background-image', '/^border/'
      ],
      {
        ignoreFunctions: false,
        ignoreValues: [
          '0', 'auto', 'inherit', 'initial', 'normal', 'unset', 'none',
          '62.5%', '100%', 'transparent', 'currentcolor', 'no-repeat', 'center', 'cover',
          'solid', 'dashed', 'dotted', 'collapse', 'separate', '50%',
          '/^calc\\(/', '/^url\\(/', '/^linear-gradient/', '/^radial-gradient/'
        ]
      }
    ]
  }
};
