import {carve} from '../carve';
import {aSample} from '../__test_support';

// language=TEXT
const source = aSample(`const still = 0;

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

const decoded = (raw) =>
    attempt(() => parse(raw))
        .mBind(check)
        .mBind(shape);

const bucketish = (trades: readonly Trade[]): readonly Candle[] =>
    trades.reduce<readonly Candle[]>((candles, trade) => {
        return candles;
    }, []);

const Row: FC<Props & {row: string}> = ({row: _row, children, ...tr}) => {
    const order = useTableSelector(selectOrder);

    return <tr {...tr}>{placed(children, order, 'column')}</tr>;
};

const looks = (carried: boolean): readonly (string | false)[] => [
    carried && 'carried'
];

type Held =
    | {axis: 'column'}
    | {axis: 'row'};

const trailing = 'never carved';
`);

const css = aSample(`.sortable .header-cell {
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

.bought {
    fill: green;
}

.bought-wall {
    fill: darkgreen;
}
`, 'src/example.css');

describe('carving examples out of the source they teach', () => {
  test('every carved line remembers the file it was taken from', () => {
    const carved = [...carve.unit(source, 'const travel = '), ...carve.span(source, 'onPointerMove', 'onPointerUp')];

    expect(new Set(carved.map(({from}) => from?.file))).toEqual(new Set([source]));
  });

  test('every carved line knows its place in the file it was taken from', () => {
    expect(carve.unit(source, 'const travel = ').map(({from}) => from?.line)).toEqual([3, 4, 5, 6, 7]);
  });

  test('a braced unit runs from its anchor to the bracket that closes it', () => {
    expect(carve.unit(source, 'const travel = ').map(({text}) => text)).toEqual([
      'const travel = (event) => {',
      '    if (event.buttons === 0) {',
      '        drop();',
      '    }',
      '};'
    ]);
  });

  test('a nested unit is dedented to its own left edge', () => {
    expect(carve.unit(source, 'surface: {').map(({text}) => text)).toEqual([
      'surface: {',
      '    onPointerMove: travel,',
      '    onPointerUp: drop',
      '}'
    ]);
  });

  test('a parenthesised unit closes on its paren, not a briefer brace', () => {
    expect(carve.unit(source, 'const seeded = ').map(({text}) => text)).toEqual([
      'const seeded = (columns) => columns.reduce((shares, {column, width}) =>',
      '    ({...shares, [column]: width}), {});'
    ]);
  });

  test('a chained expression continues through its dots', () => {
    expect(carve.unit(source, 'const decoded').map(({text}) => text)).toEqual([
      'const decoded = (raw) =>',
      '    attempt(() => parse(raw))',
      '        .mBind(check)',
      '        .mBind(shape);'
    ]);
  });

  test('array types and generics never end a unit early', () => {
    expect(carve.unit(source, 'const bucketish').map(({text}) => text)).toEqual([
      'const bucketish = (trades: readonly Trade[]): readonly Candle[] =>',
      '    trades.reduce<readonly Candle[]>((candles, trade) => {',
      '        return candles;',
      '    }, []);'
    ]);
  });

  test('a parenthesised element type never ends a unit early', () => {
    expect(carve.unit(source, 'const looks').map(({text}) => text)).toEqual([
      'const looks = (carried: boolean): readonly (string | false)[] => [',
      "    carried && 'carried'",
      '];'
    ]);
  });

  test('a brace inside a type parameter never ends a unit early', () => {
    // language=TEXT
    const row = "    return <tr {...tr}>{placed(children, order, 'column')}</tr>;";
    expect(carve.unit(source, 'const Row').map(({text}) => text)).toEqual([
      'const Row: FC<Props & {row: string}> = ({row: _row, children, ...tr}) => {',
      '    const order = useTableSelector(selectOrder);',
      '',
      row,
      '};'
    ]);
  });

  test('a union type continues through each of its members', () => {
    expect(carve.unit(source, 'type Held').map(({text}) => text)).toEqual([
      'type Held =',
      "    | {axis: 'column'}",
      "    | {axis: 'row'};"
    ]);
  });

  test('a bracketless unit ends at its own semicolon', () => {
    expect(carve.unit(source, 'const still').map(({text}) => text)).toEqual([
      'const still = 0;'
    ]);
  });

  test('an at-rule with a parenthesised prelude carves whole', () => {
    expect(carve.unit(css, '@supports not (position-area').map(({text}) => text)).toEqual([
      '@supports not (position-area: block-end) {',
      '    .menu:popover-open {',
      '        inset: 0;',
      '    }',
      '}'
    ]);
  });

  test('a keyframes block carves whole', () => {
    expect(carve.unit(css, '@keyframes displaced-left').map(({text}) => text)).toEqual([
      '@keyframes displaced-left {',
      '    from {',
      '        transform: translateX(1cqi);',
      '    }',
      '}'
    ]);
  });

  test('a css rule ends at its brace, even when the next selector starts with a dot', () => {
    expect(carve.unit(css, '.bought {').map(({text}) => text)).toEqual([
      '.bought {',
      '    fill: green;',
      '}'
    ]);
  });

  test('a css selector carries on past a pseudo-class paren into its combinator', () => {
    const sheet = aSample('.toggle:not(:checked) ~ .text {\n    height: 0;\n}\n', 'src/example.css');

    expect(carve.unit(sheet, '.toggle:not(:checked) ~ .text {').map(({text}) => text)).toEqual([
      '.toggle:not(:checked) ~ .text {',
      '    height: 0;',
      '}'
    ]);
  });

  test('a css selector carries on past a pseudo-class paren into a next-sibling combinator', () => {
    const sheet = aSample('.toggle:not(:checked) + .text {\n    height: 0;\n}\n', 'src/example.css');

    expect(carve.unit(sheet, '.toggle:not(:checked) + .text {').map(({text}) => text)).toEqual([
      '.toggle:not(:checked) + .text {',
      '    height: 0;',
      '}'
    ]);
  });

  test('a css selector carries on past a pseudo-class paren into a pseudo-element', () => {
    const sheet = aSample('.next:not(:has(.prev))::before {\n    content: "";\n}\n', 'src/example.css');

    expect(carve.unit(sheet, '.next:not(:has(.prev))::before {').map(({text}) => text)).toEqual([
      '.next:not(:has(.prev))::before {',
      '    content: "";',
      '}'
    ]);
  });

  test('a css selector carries on past a pseudo-class paren into a nesting selector', () => {
    const sheet = aSample(':is(.reveal, .drawer) &::details-content {\n    transition: none;\n}\n', 'src/example.css');

    expect(carve.unit(sheet, ':is(.reveal, .drawer) &::details-content {').map(({text}) => text)).toEqual([
      ':is(.reveal, .drawer) &::details-content {',
      '    transition: none;',
      '}'
    ]);
  });

  test('a nested css rule ends at its brace, even when the next rule starts with a nesting selector', () => {
    const sheet = aSample('&::details-content {\n    display: grid;\n}\n\n&[open]::details-content {\n    display: block;\n}\n', 'src/example.css');

    expect(carve.unit(sheet, '&::details-content {').map(({text}) => text)).toEqual([
      '&::details-content {',
      '    display: grid;',
      '}'
    ]);
  });

  test('a css block ends at its brace, even when the next selector starts with a colon', () => {
    const sheet = aSample('@media (hover: hover) {\n    .bar {\n        color: red;\n    }\n}\n\n:root {\n    gap: 0;\n}\n', 'src/example.css');

    expect(carve.unit(sheet, '@media (hover: hover) {').map(({text}) => text)).toEqual([
      '@media (hover: hover) {',
      '    .bar {',
      '        color: red;',
      '    }',
      '}'
    ]);
  });

  test('a span runs inclusively between two anchors', () => {
    expect(carve.span(source, 'onPointerMove', 'onPointerUp').map(({text}) => text)).toEqual([
      'onPointerMove: travel,',
      'onPointerUp: drop'
    ]);
  });

  test('a one-line span that leaves a bracket open fails loudly instead of teaching half a statement', () => {
    expect(() => carve.span(source, 'const seeded', 'const seeded')).toThrow(/const seeded/);
  });

  test('a one-line span that closes what it never opened fails loudly instead of teaching half a statement', () => {
    expect(() => carve.span(source, '({...shares', '({...shares')).toThrow(/shares/);
  });

  test('a one-line span may open a block it leaves for the next lines', () => {
    expect(carve.span(source, 'if (event.buttons', 'if (event.buttons').map(({text}) => text))
      .toEqual(['if (event.buttons === 0) {']);
  });

  test('a one-line span that opens a block and runs on past it fails loudly instead of teaching half a statement', () => {
    const guarded = aSample('if (ready) { drop();\n    tidy();\n}\n');

    expect(() => carve.span(guarded, 'if (ready)', 'if (ready)')).toThrow(/if \(ready\)/);
  });

  test('a one-line span that opens two blocks at once fails loudly instead of teaching half a statement', () => {
    const nested = aSample('const rule = {surface: {\n    onPointerUp: drop\n}};\n');

    expect(() => carve.span(nested, 'const rule', 'const rule')).toThrow(/const rule/);
  });

  test('an elided run gives way to an aside standing at the run’s indent', () => {
    const rule = carve.span(source, 'const rule', '};');

    expect(carve.elided(rule, 'onPointerMove', 'onPointerUp', '// …and the move').map(({text}) => text)).toEqual([
      'const rule = {',
      '    surface: {',
      '        // …and the move',
      '        onPointerUp: drop',
      '    }',
      '};'
    ]);
  });

  test('an elided run that never opens or never closes fails loudly instead of dropping the wrong lines', () => {
    const rule = carve.span(source, 'const rule', '};');

    expect(() => carve.elided(rule, 'onGone', 'onPointerUp', '// …')).toThrow(/onGone/);
    expect(() => carve.elided(rule, 'onPointerMove', 'onGone', '// …')).toThrow(/onGone/);
  });

  test('a missing anchor fails loudly instead of teaching nothing', () => {
    expect(() => carve.unit(source, 'const vanished = ')).toThrow(/vanished/);
    expect(() => carve.span(source, 'onPointerMove', 'onGone')).toThrow(/onGone/);
  });
});
