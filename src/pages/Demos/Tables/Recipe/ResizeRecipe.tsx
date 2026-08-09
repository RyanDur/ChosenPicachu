import {FC} from 'react';
import {StepEntry, StepList, aside, plain} from '../../Recipe/StepList';
import {Mdn} from '../../Recipe/Mdn';
import {span, unit} from '../../Recipe/carve';
import sharesSource from '@components/Table/shares.ts?raw';
import resizeSource from '@components/Table/ResizeHandle.tsx?raw';
import baseCss from '@components/Table/Table.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const steps: StepEntry[] = [
  {
    title: 'Keep the widths as a zero-sum ledger',
    want: 'Absolute pixel widths break the promise that the table fills its container: resize ' +
      'one column and the table grows, wraps, or leaves a gap behind.',
    says: ['Pixel widths are the first ledger you reach for, and every entry in it is a lie ' +
      'waiting for a resize: the sum answers to nobody.',
      <>Widths are shares of a hundred, born by measuring the rendered headers the first
      time a hand arrives; until then the page’s stylesheet owns the widths and no ledger
      exists. After a trade the header wears the shared class and its share rides a custom
      property, and fixed <Mdn path="Web/CSS/table-layout">table layout</Mdn>, set beside the
      opening widths in that same stylesheet, keeps the table exactly its container: every
      column a fraction of it, one record keeping one promise.</>],
    code: [
      {label: 'JS', foil: true, lines: [
        plain('const [widths, setWidths] = useState({window: 240, trades: 96});'), gap,
        plain('const resized = (column, dx) =>'),
        plain('    setWidths({...widths, [column]: widths[column] + dx});'),
        aside('// the column grows, and the table grows with it')
      ]},
      {label: 'JS', lines: [
        ...unit(sharesSource, 'export const measuredShares')
      ]},
      {label: 'HTML', lines: [
        plain("<th className=\"slot\" style={{'--share': `${share}%`}}>")
      ]},
      {label: 'CSS', lines: [
        ...unit(baseCss, '.apportioned {'), gap,
        ...unit(headerCss, '.sortable .slot {')
      ]}
    ]
  },
  {
    title: 'A handle that is a button',
    want: 'The affordance must be reachable and honest for everyone: a real control at the column’s edge, not a styled sliver of nothing.',
    says: [<>The handle is a
      native <Mdn path="Web/HTML/Element/button">button</Mdn>: focusable by birth, announcing
      itself by name, and once the ledger exists its label speaks the share too. This
      is <Mdn path="Web/Accessibility/ARIA">ARIA</Mdn>’s own first rule: prefer the native
      element, because it carries focus, announcement, and activation for free, and the
      user’s need is met by the platform instead of imitated. CSS gives it
      its post: absolute on the column’s right edge, the
      col-resize <Mdn path="Web/CSS/cursor">cursor</Mdn>,
      and <Mdn path="Web/CSS/touch-action">touch-action</Mdn>: none so the pointer can drag it
      on a touchscreen.</>],
    code: [
      {label: 'HTML', lines: [
        ...span(resizeSource, '<button type="button"', ': `resize ${column}`}')
      ]},
      {label: 'CSS', lines: [
        ...unit(baseCss, '.resize-handle {')
      ]}
    ]
  },
  {
    title: 'Trade, never take',
    want: 'Dragging one boundary must not change the table’s total width, and it must not ' +
      'starve a column down to nothing.',
    says: ['Every resize is a trade between neighbours: whatever one column gains, the next ' +
      'gives, clamped so neither side drops below the slimmest share, and because a trade only ' +
      'ever moves value between two entries of the ledger, the sum cannot change. The ' +
      'invariant is not checked; it is built in.'],
    code: [
      {label: 'JS', lines: [
        ...unit(sharesSource, 'export const traded')
      ]}
    ]
  },
  {
    title: 'Capture the pointer, measure once',
    want: 'Pointer positions arrive in pixels while the ledger speaks in shares, and asking ' +
      'the DOM for the table’s width on every move brings back layout thrash.',
    says: [<>On pointerdown the
      handle <Mdn path="Web/API/Element/setPointerCapture">captures its pointer</Mdn> (safe
      here, because unlike the sort’s cells the handle never moves in the DOM) and measures the
      table once: pixels per share. Each move converts the drag into shares and trades only the
      increment since the last one, so a clamped trade never accumulates error.</>],
    code: [
      {label: 'JS', lines: [
        ...unit(resizeSource, 'onPointerDown={(event'), gap,
        ...unit(resizeSource, 'onPointerMove={(event')
      ]}
    ]
  },
  {
    title: 'Two gestures, one header',
    want: 'The handle lives inside a draggable header, so pressing it would lift the whole ' +
      'column into a drag.',
    says: [<>The
      handle <Mdn path="Web/API/Event/stopPropagation">stops pointer descent</Mdn>, so the sort
      never hears the press, and the keyboard gets its own road: focus the handle and the
      arrow keys trade a fixed step, no pointer required.</>],
    code: [
      {label: 'JS', lines: [
        ...span(resizeSource, 'onMouseDown={event => event.stopPropagation()}',
          'onMouseDown={event => event.stopPropagation()}'), gap,
        ...unit(resizeSource, 'onKeyDown={(event'),
        aside('// the column dial above never hears a thing')
      ]}
    ]
  }
];

export const ResizeRecipe: FC = () =>
  <section aria-label="build the drag resize yourself" className="build-steps">
    <header className="brief-line">
      <h2 className="kicker">build the drag resize yourself</h2>
      <p className="brief">Five steps that share the table the drag sort already built.</p>
    </header>
    <p className="lead">
      You want column boundaries you can drag while the table always fills its container:
      widen a column and its neighbour gives up the space, never the table’s edge. That
      takes a record of widths that cannot sum to more or less than the whole, no matter what
      the hand does.
    </p>
    <StepList steps={steps}/>
  </section>;
