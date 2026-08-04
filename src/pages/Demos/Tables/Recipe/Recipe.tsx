import {FC, ReactNode} from 'react';
import {Link} from 'react-router';
import {join} from '@components/class-names';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Origin, Pace} from '../Controls';
import {Line, Snippet} from './Snippet';
import {SlotsFigure} from './SlotsFigure';
import './Recipe.css';

type Step = {
  title: string;
  says: string[];
  tuned?: boolean;
  figure?: ReactNode;
  code: Line[][];
};

const plain = (text: string): Line => ({text});
const aside = (text: string): Line => ({text, dim: true});

const labourCss = [
  plain('.grabbable { cursor: grab; touch-action: none; }'),
  plain('.grabbable:active { cursor: grabbing; }'),
  plain('.sortable { user-select: none; }'),
  plain('.drag-surface { position: fixed; inset: 0; cursor: grabbing; }')
];

const held = (pace: Pace): Step => pace === 'eager'
  ? {
    title: 'Commit inside the move',
    tuned: true,
    says: ['With eager pace, settle as soon as a neighbour is struck — the list reorders under ' +
      'the pointer, so what you see during the drag is already the result. Keyed rendering moves ' +
      'the real cells, and carrying the column back is just more crossings: home is always reachable.'],
    code: [[
      plain('onPointerMove: event => {'),
      plain('  const struck = strike(event.clientX, event.clientY, aloft);'),
      plain('  if (has(aloft) && has(struck) && struck !== aloft)'),
      plain('    settle(aloft, struck);'),
      plain('}')
    ]]
  }
  : {
    title: 'Stash the landing, commit on release',
    tuned: true,
    says: ['With lazy pace, remember the last neighbour struck and do nothing else — the table ' +
      'holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot ' +
      'clears the landing, so a drop at home changes nothing.'],
    code: [[
      plain('onPointerMove: event => {'),
      plain('  const struck = strike(event.clientX, event.clientY, aloft);'),
      plain('  setLanding(struck === aloft ? undefined : struck);'),
      plain('},'),
      plain('onPointerUp: () => {'),
      plain('  if (has(aloft) && has(landing))'),
      plain('    settle(aloft, landing);'),
      plain('}')
    ]]
  };

const shown = (origin: Origin): Step => origin === 'hide'
  ? {
    title: 'Blank the origin while it is aloft',
    tuned: true,
    says: ['The origin dial is already the flag — derive it by comparison, never by parsing a ' +
      'style string apart. Pass it down and drop the lifted key out of the header and every row — ' +
      'only the ghost reads as real, and the gap shows exactly where the drop will land. Nothing ' +
      'unmounts: CSS turns the text and rules transparent while the lane keeps its right edge to ' +
      'mark the gap.'],
    code: [
      [
        plain('const hiding = origin === \'hide\';'),
        plain('<DraggableHeader hidden={hiding && aloft === key} ... />'),
        plain('<DraggableRow hiddenColumn={hiding ? aloft : undefined} ... />')
      ],
      [
        plain('.sortable .hide { color: transparent; }'),
        plain('.fancy-table.sortable .hide { border-bottom-color: transparent; }'),
        aside('/* the hidden lane keeps only its right edge */')
      ]
    ]
  }
  : {
    title: 'Leave the origin in place while it is aloft',
    tuned: true,
    says: ['Render the lifted key normally underneath the ghost. There are two of it for the ' +
      'length of the drag, which reads as a copy being carried out of a still-intact table.'],
    code: [[
      plain('const hiding = origin === \'hide\';  // \'keep\' — so false'),
      plain('<DraggableHeader hidden={false} ... />'),
      aside('// the lifted cells keep rendering in their seats')
    ]]
  };

const moved = (animated: boolean): Step => animated
  ? {
    title: 'Slide the theater, not the layout',
    tuned: true,
    says: [
      'A column swap commits instantly — the carried column already sits at full width in its ' +
      'new slot, hidden or under the ghost, and the layout underneath is final. The displaced ' +
      'column is merely drawn where it used to be, sliding home on a transform. Transforms cannot ' +
      'move layout, so nothing else can shift: a bounce is impossible by construction.',
      'CSS knows the distance without measuring. Make the table a size container and 1cqi is one ' +
      'percent of its width, so the slide starts at the carried column’s share — a value already ' +
      'in state — plus its padding. @starting-style declares where the slide begins, one render ' +
      'starts it, and transitionend hands the class back.',
      'Rows are the same theater turned vertical. Their heights are measured once, in whatever ' +
      'event reorders them — the lift, a nudge, a sort ruling — and the difference between each ' +
      'row’s old and new position becomes a pixel offset: every displaced row starts at ' +
      'translateY(var(--drop)) and slides home. Nothing in this table rides a view transition; ' +
      'the motion is transitions all the way down, each one started by @starting-style.'
    ],
    code: [
      [
        plain('.table-stage { container-type: inline-size; }'),
        plain(''),
        plain('.sortable .displaced-left {'),
        plain('  transition: transform 200ms ease-out;'),
        plain(''),
        plain('  @starting-style {'),
        plain('    transform: translateX(calc(var(--carried) * 1cqi + var(--pad)));'),
        plain('  }'),
        plain('}'),
        aside('/* .displaced-right mirrors with a negative offset */')
      ],
      [
        plain('const displaced = from < to'),
        plain('  ? order.slice(from + 1, to + 1)'),
        plain('  : order.slice(to, from);'),
        plain('setSlid({keys: displaced, carried: shares[key],'),
        plain("         toward: from < to ? 'left' : 'right', wave: wave + 1});"),
        aside('// key={displaced ? `${key}#${wave}` : key} — a fresh node starts the slide')
      ],
      [
        plain('const shifts = (heights, before, after) =>'),
        plain('  offsets(tops(before), tops(after));   // oldY - newY, per seat'),
        plain(''),
        plain('setShifted({offsets: shifts(heights, standing, after),'),
        plain('            wave: wave + 1});'),
        aside("// <tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}"),
        aside('//     key={drop ? `${seat}#${wave}` : seat}>')
      ]
    ]
  }
  : {
    title: 'Apply the state update directly',
    tuned: true,
    says: ['Call the updater and let React paint — the new order is on screen in the next frame. ' +
      'There is real value in this mode beyond taste: no animation means nothing competes with ' +
      'the pointer, no overlay to swallow events, and no motion for prefers-reduced-motion users ' +
      'to endure.'],
    code: [[
      plain('const glide = animated => update => {'),
      plain('  update();'),
      plain('};')
    ]]
  };

const steps = (pace: Pace, origin: Origin, animated: boolean): Step[] => [
  {
    title: 'Let CSS carry its share',
    says: ['The open hand and the closed fist are cursors. touch-action: none is the single line ' +
      'that lets pointer events drag on a touchscreen; user-select: none keeps a fast drag from ' +
      'sweeping text selections across the page; and the hiding styles, later on, are nothing but ' +
      'transparent colors. None of this is state — the stylesheet carries it.'],
    code: [labourCss]
  },
  {
    title: 'Keep the order in state, not in the data',
    says: ['Rows and columns arrive in whatever order the fold produced. Hold a separate list of ' +
      'keys and seats, and render through it, so a reorder never touches the data.'],
    code: [[
      plain('const [order, setOrder] = useState(() =>'),
      plain('  columns.map(({column}) => String(column)));'),
      plain('const [seats, setSeats] = useState(() =>'),
      plain('  rows.map((_, seat) => seat));'),
      aside('// render: order.map(key => byKey.get(key))')
    ]]
  },
  {
    title: 'Lift on pointer down, and measure the table once',
    says: ['On pointerdown over a header (or a row’s grip), record which key is aloft and ' +
      'measure the table’s bounding rect a single time — call it the chart. Everything that ' +
      'follows is math against the chart; measuring per move would fight the reorder you are ' +
      'about to apply, and the DOM is never asked where things are again.'],
    code: [[
      plain('const lift = (key, anchor) => () => {'),
      plain('  setChart(charted(anchor.closest("table"), arranged));'),
      plain('  setFlight(anchor.getBoundingClientRect());'),
      plain('  setAloft(key);'),
      plain('};')
    ]]
  },
  {
    title: 'Give the drag a surface of its own',
    says: ['While something is aloft, render a fixed, full-viewport element and give it the move ' +
      'and drop handlers. Because React re-renders it on every settle, the handlers are always ' +
      'fresh — no stale closures, no document listeners — and it physically blocks hover styles ' +
      'beneath it for free. Hold pointer capture on it, and treat losing the capture as the drop: ' +
      'releases can vanish into odd corners of the platform, and the capture going away is the ' +
      'one signal that always arrives.'],
    code: [[
      plain('{aloft &&'),
      plain('  <article className="drag-surface"   /* position: fixed; inset: 0 */'),
      plain('           onPointerMove={travel}'),
      plain('           onPointerUp={drop}'),
      plain('           onLostPointerCapture={drop}/>}')
    ]]
  },
  {
    title: 'Draw the ghost by hand',
    says: ['The column in your hand is not a clone of DOM nodes — it is a second table rendered ' +
      'from the same data, fixed at the lift point, its transform rendered from a drift held in ' +
      'state. No element handles, no refs: each pointer move sets the drift, and React paints ' +
      'the translation. Nothing is measured per move, which is what keeps slower engines smooth.'],
    code: [[
      plain('<table className="column-ghost"'),
      plain('       style={{position: \'fixed\', top: flight.y, left: flight.x,'),
      plain('               width: flight.width, pointerEvents: \'none\','),
      plain('               transform: `translate(${drift.x}px, ${drift.y}px)`}}>'),
      aside('  {/* the same cells, rendered again from the data */}'),
      plain('</table>'),
      plain(''),
      plain('onPointerMove: event =>'),
      plain('  setDrift({x: event.clientX - origin.x, y: event.clientY - origin.y});')
    ]]
  },
  {
    title: 'Find the neighbour under the pointer, with a dead zone',
    says: ['Where the pointer is, in table terms, is a walk over cumulative column widths — ' +
      'arithmetic on the chart, not elementFromPoint. A neighbour only yields once the pointer ' +
      'reaches its inner half: the outer quarter is a dead zone, without which the reorder ' +
      'oscillates when a wide column passes a narrow one. After a swap the pointer sits over the ' +
      'carried column itself — a no-op — so reversing means deliberately reaching the ' +
      'neighbour’s inner half again. Hysteresis, for free, from geometry.'],
    figure: <SlotsFigure/>,
    code: [[
      plain('const struck = slots.find(({end}) => x < end);'),
      plain('const held = Math.max(struck.width / 4, (struck.width - aloftWidth) / 2);'),
      plain('const homeward = order.indexOf(struck.key) < order.indexOf(aloft);'),
      plain('return (homeward ? x < struck.end - held : x > struck.start + held)'),
      plain('  ? struck.key'),
      plain('  : undefined;')
    ]]
  },
  held(pace),
  shown(origin),
  moved(animated)
];

type Props = {
  pace: Pace;
  origin: Origin;
  animated: boolean;
};

export const Recipe: FC<Props> = ({pace, origin, animated}) =>
  <section aria-label="build it from scratch" className="build-steps">
    <header className="brief-line">
      <h2 className="kicker">build it from scratch</h2>
      <p className="brief">
        Nine steps, no library. Steps marked <em className="chip">set above</em> are written the
        way the controls are currently set.
      </p>
    </header>
    <p className="lead">
      There are two roads to dragging something across a page, and this site walks both. The{' '}
      <Link className="signpost" to={`${Paths.demos}?tab=${DemoTopics.dragAndDrop}`}>Drag and Drop
      demo</Link> takes the native API — draggable, dragstart, dragover, drop — where the platform
      brings the drag image, the drop rules, and most of the behavior for very little code. That
      generosity has edges: the drag image cannot be made opaque on macOS, the cursor belongs to
      the platform, and an animation cannot run while a native drag session is alive.
    </p>
    <p className="lead">
      This table takes the other road: pointer events, where every pixel of the interaction is
      owned. Owned is not the same as scripted — the markup stays a real table with real headers,
      the row grip is a button so arrow keys reorder rows without a line of drag code, CSS carries
      the cursors, the hiding, and the hover-taming, and JavaScript is left holding only what
      neither can: one measurement, some arithmetic, and the order.
    </p>
    <ol className="steps">
      {steps(pace, origin, animated).map(step =>
        <li className={join('step', step.tuned && 'tuned')} key={step.title}>
          <article className="step-body">
            <h3 className="step-title">
              {step.title}
              {step.tuned && <em className="chip">set above</em>}
            </h3>
            <div className="step-flow">
              <div className="step-words">
                {step.says.map(paragraph => <p className="step-says" key={paragraph}>{paragraph}</p>)}
                {step.figure}
              </div>
              <div className="step-code">
                {step.code.map((lines, at) => <Snippet lines={lines} key={at}/>)}
              </div>
            </div>
          </article>
        </li>)}
    </ol>
  </section>;
