import {FC} from 'react';
import {StepEntry, StepList, aside, plain} from './StepList';
import './Recipe.css';

const steps: StepEntry[] = [
  {
    title: 'Keep the widths as a zero-sum ledger',
    want: 'The problem: absolute pixel widths break the promise that the table fills its ' +
      'container — resize one column and the table grows, wraps, or leaves a gap behind.',
    says: ['Widths are shares of a hundred, seeded once from the declared weights. The markup ' +
      'renders each header through its share, and fixed table layout does the rest: the table is ' +
      'always exactly its container, and every column is a fraction of it. One record, one ' +
      'promise.'],
    code: [
      {label: 'JS', lines: [
        plain('const seededShares = (columns) => {'),
        plain('    const sized = columns.filter(({width}) => has(width));'),
        plain('    const total = sized.reduce((sum, {width}) => sum + width, 0);'),
        plain('    return sized.reduce((shares, {column, width}) =>'),
        plain('        ({...shares, [column]: width / total * 100}), {});'),
        plain('};')
      ]},
      {label: 'HTML', lines: [
        plain("<th className=\"slot\" style={{'--share': `${share}%`}}>")
      ]},
      {label: 'CSS', lines: [
        plain('.apportioned { table-layout: fixed; width: 100%; }'),
        plain('.sortable .slot { width: var(--share); }')
      ]}
    ]
  },
  {
    title: 'A handle that announces itself',
    want: 'The problem: a resize affordance is invisible to assistive tech unless it says what ' +
      'it is, where it stands, and how far it can go.',
    says: ['The handle is a real separator with a value: now, minimum, and maximum, focusable ' +
      'from the keyboard. CSS gives it its post — absolute on the column’s right edge, the ' +
      'col-resize cursor, and touch-action: none so the pointer can drag it on a touchscreen.'],
    code: [
      {label: 'HTML', lines: [
        plain('<i role="separator"'),
        plain('   tabIndex={0}'),
        plain('   aria-orientation="vertical"'),
        plain('   aria-label={`resize ${column}`}'),
        plain('   aria-valuenow={Math.round(share)}'),
        plain('   aria-valuemin={SLIMMEST}'),
        plain('   aria-valuemax={100 - SLIMMEST}/>')
      ]},
      {label: 'CSS', lines: [
        plain('.resize-handle {'),
        plain('    position: absolute;'),
        plain('    top: 0;'),
        plain('    right: 0;'),
        plain('    width: var(--base);'),
        plain('    height: 100%;'),
        plain('    cursor: col-resize;'),
        plain('    touch-action: none;'),
        plain('}')
      ]}
    ]
  },
  {
    title: 'Trade, never take',
    want: 'The problem: dragging one boundary must not change the table’s total width or starve ' +
      'a column down to nothing.',
    says: ['Every resize is a trade between neighbours: whatever one column gains, the next ' +
      'gives. The trade is clamped so neither side drops below the slimmest share — and because ' +
      'it only ever moves value between two entries of the ledger, the sum cannot change. The ' +
      'invariant is not checked; it is built in.'],
    code: [
      {label: 'JS', lines: [
        plain('const traded = (column, neighbor, delta) => (previous) => {'),
        plain('    const given = Math.min('),
        plain('        Math.max(delta, SLIMMEST - previous[column]),'),
        plain('        previous[neighbor] - SLIMMEST'),
        plain('    );'),
        plain('    return {...previous,'),
        plain('        [column]: previous[column] + given,'),
        plain('        [neighbor]: previous[neighbor] - given};'),
        plain('};')
      ]}
    ]
  },
  {
    title: 'Capture the pointer, measure once',
    want: 'The problem: pointer positions arrive in pixels but the ledger speaks in shares — ' +
      'and asking the DOM for the table’s width on every move brings back layout thrash.',
    says: ['On pointerdown the handle captures its pointer — safe here, because unlike the ' +
      'sort’s cells the handle never moves in the DOM — and measures the table once: pixels per ' +
      'share. Each move converts the drag into shares and trades only the increment since the ' +
      'last one, so a clamped trade never accumulates error.'],
    code: [
      {label: 'JS', lines: [
        plain('onPointerDown: event => {'),
        plain('    event.currentTarget.setPointerCapture?.(event.pointerId);'),
        plain('    const width = event.currentTarget.closest("table")'),
        plain('        .getBoundingClientRect().width;'),
        plain('    setGrip({fromX: event.clientX, pxPerShare: width / 100});'),
        plain('    setTraded(0);'),
        plain('},'),
        plain('onPointerMove: event => {'),
        plain('    const sought = (event.clientX - grip.fromX) / grip.pxPerShare;'),
        plain('    onTrade(sought - traded);'),
        plain('    setTraded(sought);'),
        plain('}')
      ]}
    ]
  },
  {
    title: 'Two gestures, one header',
    want: 'The problem: the handle lives inside a draggable header — pressing it would lift ' +
      'the whole column into a drag.',
    says: ['The handle stops pointer descent, so the sort never hears the press. And the ' +
      'keyboard gets its own road: focus the separator and the arrow keys trade a fixed step, ' +
      'no pointer required.'],
    code: [
      {label: 'JS', lines: [
        plain('onPointerDown: event => event.stopPropagation(),'),
        plain('onKeyDown: event => {'),
        plain("    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {"),
        plain('        return;'),
        plain('    }'),
        plain('    event.preventDefault();'),
        plain("    onTrade(event.key === 'ArrowRight' ? STEP_SHARE : -STEP_SHARE);"),
        plain('}'),
        aside('// the column dial above never hears a thing')
      ]}
    ]
  }
];

export const ResizeRecipe: FC = () =>
  <section aria-label="build the drag resize yourself" className="build-steps">
    <header className="brief-line">
      <h2 className="kicker">build the drag resize yourself</h2>
      <p className="brief">Five steps, sharing the table the drag sort already built.</p>
    </header>
    <p className="lead">
      The want: column boundaries you can drag, with the table always filling its container —
      widen a column and its neighbour gives up the space, never the table’s edge. The need: a
      record of widths that cannot sum to more or less than the whole, no matter what the hand
      does.
    </p>
    <StepList steps={steps}/>
  </section>;
