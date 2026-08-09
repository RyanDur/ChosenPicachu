import {span, unit} from '../carve';

const source = `const still = 0;

const travel = (event) => {
    if (event.buttons === 0) {
        drop();
    }
};

const rule = {
    surface: {
        onPointerMove: travel,
        onPointerUp: drop
    }
};

const seeded = (columns) => columns.reduce((shares, {column, width}) =>
    ({...shares, [column]: width}), {});
`;

const css = `.sortable .header-cell {
    width: var(--share);
}

@supports not (position-area: block-end) {
    .menu:popover-open {
        inset: 0;
    }
}

@keyframes displaced-left {
    from {
        transform: translateX(1cqi);
    }
}
`;

describe('carving examples out of the source they teach', () => {
  test('a braced unit runs from its anchor to the bracket that closes it', () => {
    expect(unit(source, 'const travel = ').map(({text}) => text)).toEqual([
      'const travel = (event) => {',
      '    if (event.buttons === 0) {',
      '        drop();',
      '    }',
      '};'
    ]);
  });

  test('a nested unit is dedented to its own left edge', () => {
    expect(unit(source, 'surface: {').map(({text}) => text)).toEqual([
      'surface: {',
      '    onPointerMove: travel,',
      '    onPointerUp: drop',
      '}'
    ]);
  });

  test('a parenthesised unit closes on its paren, not a briefer brace', () => {
    expect(unit(source, 'const seeded = ').map(({text}) => text)).toEqual([
      'const seeded = (columns) => columns.reduce((shares, {column, width}) =>',
      '    ({...shares, [column]: width}), {});'
    ]);
  });

  test('an at-rule with a parenthesised prelude carves whole', () => {
    expect(unit(css, '@supports not (position-area').map(({text}) => text)).toEqual([
      '@supports not (position-area: block-end) {',
      '    .menu:popover-open {',
      '        inset: 0;',
      '    }',
      '}'
    ]);
  });

  test('css rules and keyframes carve the same way', () => {
    expect(unit(css, '@keyframes displaced-left').map(({text}) => text)).toEqual([
      '@keyframes displaced-left {',
      '    from {',
      '        transform: translateX(1cqi);',
      '    }',
      '}'
    ]);
  });

  test('a span runs inclusively between two anchors', () => {
    expect(span(source, 'onPointerMove', 'onPointerUp').map(({text}) => text)).toEqual([
      'onPointerMove: travel,',
      'onPointerUp: drop'
    ]);
  });

  test('a missing anchor fails loudly instead of teaching nothing', () => {
    expect(() => unit(source, 'const vanished = ')).toThrow(/vanished/);
    expect(() => span(source, 'onPointerMove', 'onGone')).toThrow(/onGone/);
  });
});
