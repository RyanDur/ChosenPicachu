import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

const structure = [
  'display', '/^grid/', '/^flex/', 'gap', 'row-gap', 'column-gap', 'order',
  'position', '/^inset/', 'top', 'right', 'bottom', 'left', 'z-index', '/^position-/', 'anchor-name',
  '/^padding/', '/^margin/', 'box-sizing',
  'width', 'height', '/^min-/', '/^max-/', 'inline-size', 'block-size', 'aspect-ratio',
  '/^align-/', '/^justify-/', '/^place-/',
  '/^overflow/', 'white-space', 'writing-mode', 'contain', '/^container/', 'isolation', 'resize',
  '/^transform/', 'translate', 'rotate', 'scale', '/^transition/', '/^animation/', '/^interpolate/',
  '/^--/', 'syntax', 'inherits', 'initial-value',
  'content', 'visibility', 'opacity', 'pointer-events', 'cursor', 'touch-action', 'user-select', '/^scroll-/',
  'vertical-align', 'text-align', 'text-indent', 'text-wrap', 'text-overflow',
  'table-layout', 'border-collapse', 'border-spacing', '/^border(-(block|inline|top|right|bottom|left)(-(start|end))?)?-width$/',
  'counter-reset', 'counter-increment', 'list-style-type',
  'stroke-width', 'vector-effect', 'stroke-dasharray', 'stroke-linejoin', 'stroke-linecap'
];

export default {
  overrides: [
    {
      files: ['src/**/*.css'],
      rules: {
        'property-allowed-list': [structure, {
          message: property => `"${property}" is a look; a component sheet holds structure, and a look is a word in src/styles that the element wears as a class`
        }]
      }
    },
    {files: ['src/styles/**/*.css', 'src/index.css'], rules: {'property-allowed-list': null}},
    {files: ['src/styles/surface.css'], rules: {'property-disallowed-list': null}},
    {files: ['src/styles/reset.css'], rules: {'selector-max-type': null}}
  ],
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
    'selector-max-type': [0, {
      // the argument of ::view-transition-old(root) is a transition's name, which the parser reads as a tag
      ignoreTypes: ['root'],
      message: 'a tag is styled only in src/styles/reset.css; give the element a class'
    }],
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
