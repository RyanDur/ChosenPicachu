import {FC, ReactNode} from 'react';
import {Link} from 'react-router';
import {join} from '@components/class-names';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Line, Snippet} from './Snippet';
import {SlotsFigure} from './SlotsFigure';
import './Recipe.css';

type Block = {
  label: 'HTML' | 'CSS' | 'JS';
  lines: Line[];
};

type Step = {
  title: string;
  says: string[];
  tuned?: boolean;
  figure?: ReactNode;
  code: Block[];
};

const plain = (text: string): Line => ({text});
const aside = (text: string): Line => ({text, dim: true});

const held = (pace: 'eager' | 'lazy'): Step => pace === 'eager'
  ? {
    title: 'Commit inside the move',
    tuned: true,
    says: ['With eager pace, settle as soon as a neighbour is struck — the order state updates ' +
      'mid-drag, and because the markup renders through that order, the same key finds its new ' +
      'seat and React moves the real cells. Carrying the column back is just more crossings: ' +
      'home is always reachable. No style changes hands here at all.'],
    code: [
      {label: 'JS', lines: [
        plain('onPointerMove: event => {'),
        plain('  const struck = strike(event.clientX, event.clientY, aloft);'),
        plain('  if (has(aloft) && has(struck) && struck !== aloft)'),
        plain('    settle(aloft, struck);'),
        plain('}')
      ]},
      {label: 'HTML', lines: [
        plain('<DraggableHeader key={key} ... />'),
        aside('{/* same key, new seat — React moves the node, not a copy */}')
      ]}
    ]
  }
  : {
    title: 'Stash the landing, commit on release',
    tuned: true,
    says: ['With lazy pace, remember the last neighbour struck and do nothing else — the table ' +
      'holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot ' +
      'clears the landing, so a drop at home changes nothing.'],
    code: [
      {label: 'JS', lines: [
        plain('onPointerMove: event => {'),
        plain('  const struck = strike(event.clientX, event.clientY, aloft);'),
        plain('  setLanding(struck === aloft ? undefined : struck);'),
        plain('},'),
        plain('onPointerUp: () => {'),
        plain('  if (has(aloft) && has(landing))'),
        plain('    settle(aloft, landing);'),
        plain('}')
      ]}
    ]
  };

const shown = (origin: 'keep' | 'hide'): Step => origin === 'hide'
  ? {
    title: 'Blank the origin while it is aloft',
    tuned: true,
    says: ['Three languages, one disappearance. JavaScript knows only a boolean — the origin dial ' +
      'is already the flag, derived by comparison. The markup passes it down as a class on the ' +
      'lifted key’s cells. CSS does the vanishing with a single word: visibility hidden takes ' +
      'the whole column — text, borders, grip, everything — while its layout space remains as ' +
      'the gap where the drop will land. Nothing unmounts.'],
    code: [
      {label: 'JS', lines: [
        plain("const hiding = origin === 'hide';")
      ]},
      {label: 'HTML', lines: [
        plain('<DraggableHeader hidden={hiding && aloft === key} ... />'),
        plain('<DraggableRow hiddenColumn={hiding ? aloft : undefined} ... />')
      ]},
      {label: 'CSS', lines: [
        plain('.sortable .hide,'),
        plain('.sortable .hide-across {'),
        plain('  visibility: hidden;'),
        plain('}'),
        aside('/* the box stops painting; its layout space stays */')
      ]}
    ]
  }
  : {
    title: 'Leave the origin in place while it is aloft',
    tuned: true,
    says: ['Render the lifted key normally underneath the ghost. There are two of it for the ' +
      'length of the drag, which reads as a copy being carried out of a still-intact table. ' +
      'The hidden flag simply never reaches the markup, so CSS has nothing to erase.'],
    code: [
      {label: 'HTML', lines: [
        plain('<DraggableHeader hidden={false} ... />'),
        aside('{/* the lifted cells keep rendering in their seats */}')
      ]}
    ]
  };

const moved = (animated: boolean): Step => animated
  ? {
    title: 'Slide the theater, not the layout',
    tuned: true,
    says: [
      'A swap commits instantly — the carried column already sits at full width in its new slot, ' +
      'hidden or under the ghost, and the layout underneath is final. The displaced column is ' +
      'merely drawn where it used to be, sliding home on a transform. Transforms cannot move ' +
      'layout, so nothing else can shift: a bounce is impossible by construction.',
      'The three languages split the trick cleanly. JavaScript marks who was displaced and hands ' +
      'over two numbers it already owns — the carried share, each row’s drop. The markup ' +
      'carries the mark as a class that arrives exactly as the reorder moves the node. CSS does ' +
      'all the moving: the table is a size container, so 1cqi is one percent of its width, and a ' +
      'keyframe’s from is the old position — applying the class starts the slide fresh, and ' +
      'animationend hands the class back.',
      'Rows are the same theater turned vertical: heights measured once, in whatever event ' +
      'reorders them, become per-row pixel offsets, and every displaced row starts at ' +
      'translateY(var(--drop)) and slides home. Nothing in this table rides a view transition; ' +
      'every motion is a keyframe starting from where things used to be.'
    ],
    code: [
      {label: 'JS', lines: [
        plain('setSlid({keys: displaced, carried: shares[key],'),
        plain("         toward: from < to ? 'left' : 'right'});"),
        plain('setShifted(shifts(heights, standing, after));'),
        aside('// two numbers and some names — javascript is done')
      ]},
      {label: 'HTML', lines: [
        plain("<th className={displaced && `displaced-${toward}`} ... >"),
        plain("<tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}>"),
        aside('{/* the reorder moves the node; the class rides along */}')
      ]},
      {label: 'CSS', lines: [
        plain('.table-stage { container-type: inline-size; }'),
        plain(''),
        plain('.sortable .displaced-left { animation: displaced-left 200ms ease-out; }'),
        plain('.sortable .shifted { animation: shifted 200ms ease-out; }'),
        plain(''),
        plain('@keyframes displaced-left {'),
        plain('  from {'),
        plain('    transform: translateX(calc(var(--carried) * 1cqi + var(--pad)));'),
        plain('  }'),
        plain('}'),
        plain(''),
        plain('@keyframes shifted {'),
        plain('  from { transform: translateY(var(--drop)); }'),
        plain('}'),
        aside('/* .displaced-right mirrors with a negative offset */')
      ]}
    ]
  }
  : {
    title: 'Apply the state update directly',
    tuned: true,
    says: ['Call the updater and let React paint — the new order is on screen in the next frame. ' +
      'No classes, no keyframes, nothing marked. There is real value in this mode beyond taste: ' +
      'no animation means nothing competes with the pointer, and no motion for ' +
      'prefers-reduced-motion users to endure.'],
    code: [
      {label: 'JS', lines: [
        plain('setOrder(next);   // React paints the new order in place — done'),
        aside('// animated only decides whether anyone gets a slide class')
      ]}
    ]
  };

const steps = (pace: 'eager' | 'lazy', origin: 'keep' | 'hide', animated: boolean): Step[] => [
  {
    title: 'Let CSS carry its share',
    says: [
      'The markup stays honest HTML: a real table with real headers, so the semantics come free. ' +
      'The row grip is a button — arrow keys reorder rows without a line of drag code — and the ' +
      'resize handle is a separator that announces its value.',
      'CSS carries more of the effect than it appears: the open hand and the closed fist are ' +
      'cursors, touch-action: none is the single line that lets pointer events drag on a ' +
      'touchscreen, and user-select: none keeps a fast drag from sweeping text selections. ' +
      'JavaScript is left holding only what neither can: one measurement, some arithmetic, and ' +
      'the order.'
    ],
    code: [
      {label: 'HTML', lines: [
        plain('<table><thead><tr><th scope="col">window</th> ...'),
        plain('<button className="grip" aria-label="move row 2"><Handle/></button>'),
        plain('<i role="separator" aria-label="resize trades" aria-valuenow={24}/>')
      ]},
      {label: 'CSS', lines: [
        plain('.grabbable { cursor: grab; touch-action: none; }'),
        plain('.grabbable:active { cursor: grabbing; }'),
        plain('.sortable { user-select: none; }'),
        plain('.drag-surface { position: fixed; inset: 0; cursor: grabbing; }')
      ]},
      {label: 'JS', lines: [
        aside('// one measurement, slot arithmetic, and the order — nothing else')
      ]}
    ]
  },
  {
    title: 'Keep the order in state, not in the data',
    says: ['Rows and columns arrive in whatever order the fold produced. Hold a separate list of ' +
      'keys and seats, and render the markup through it, so a reorder never touches the data — ' +
      'the same key finds its new seat and React moves the real nodes.'],
    code: [
      {label: 'JS', lines: [
        plain('const [order, setOrder] = useState(() =>'),
        plain('  columns.map(({column}) => String(column)));'),
        plain('const [seats, setSeats] = useState(() =>'),
        plain('  rows.map((_, seat) => seat));')
      ]},
      {label: 'HTML', lines: [
        plain('<tr>{order.map(key =>'),
        plain('  <DraggableHeader key={key} column={byKey.get(key)} ... />)}</tr>')
      ]}
    ]
  },
  {
    title: 'Lift on pointer down, and measure the table once',
    says: ['The hand is CSS before anything happens — grab on hover, grabbing on press — and ' +
      'touch-action: none is why the pointer can drag on touch at all. On pointerdown, ' +
      'JavaScript records which key is aloft and measures the table’s bounding rect a single ' +
      'time — the chart. Everything that follows is math against the chart; measuring per move ' +
      'would fight the reorder you are about to apply.'],
    code: [
      {label: 'JS', lines: [
        plain('const lift = (key, anchor) => () => {'),
        plain('  setChart(charted(anchor.closest("table"), arranged));'),
        plain('  setFlight(anchor.getBoundingClientRect());'),
        plain('  setAloft(key);'),
        plain('};')
      ]},
      {label: 'CSS', lines: [
        plain('.grabbable { cursor: grab; touch-action: none; }'),
        plain('.grabbable:active { cursor: grabbing; }')
      ]}
    ]
  },
  {
    title: 'Give the drag a surface of its own',
    says: ['While something is aloft, the markup grows a fixed, full-viewport element carrying ' +
      'the move and drop handlers. Because React re-renders it on every settle, the handlers are ' +
      'always fresh — no stale closures, no document listeners. CSS gives it the grabbing cursor ' +
      'and, by mere existence, it blocks hover styles beneath it — no state, no class-toggling. ' +
      'Hold pointer capture on it, and treat losing the capture as the drop: releases can vanish ' +
      'into odd corners of the platform, and the capture going away is the one signal that ' +
      'always arrives.'],
    code: [
      {label: 'HTML', lines: [
        plain('{aloft &&'),
        plain('  <article className="drag-surface"'),
        plain('           onPointerMove={travel}'),
        plain('           onPointerUp={drop}'),
        plain('           onPointerCancel={drop}'),
        plain('           onLostPointerCapture={drop}/>}'),
        aside('{/* cancel and lost capture are not delegates — they ARE the drop */}')
      ]},
      {label: 'CSS', lines: [
        plain('.drag-surface { position: fixed; inset: 0; cursor: grabbing; }'),
        plain('.sortable { user-select: none; }'),
        aside('/* hover below is blocked by existence; selection never starts */')
      ]}
    ]
  },
  {
    title: 'Draw the ghost by hand',
    says: ['The column in your hand is not a clone of DOM nodes — it is a second table rendered ' +
      'from the same data, fixed at the lift point, its transform rendered from a drift held in ' +
      'state. Each pointer move sets the drift and React paints the translation; CSS keeps the ' +
      'ghost out of hit-testing with pointer-events: none and promises the browser motion with ' +
      'will-change. Nothing is measured per move, which is what keeps slower engines smooth.'],
    code: [
      {label: 'HTML', lines: [
        plain('<table className="column-ghost"'),
        plain('       style={{position: \'fixed\', top: flight.y, left: flight.x,'),
        plain('               width: flight.width,'),
        plain('               transform: `translate(${drift.x}px, ${drift.y}px)`}}>'),
        aside('  {/* the same cells, rendered again from the data */}'),
        plain('</table>')
      ]},
      {label: 'JS', lines: [
        plain('onPointerMove: event =>'),
        plain('  setDrift({x: event.clientX - origin.x, y: event.clientY - origin.y});')
      ]},
      {label: 'CSS', lines: [
        plain('.column-ghost { pointer-events: none; will-change: transform; }')
      ]}
    ]
  },
  {
    title: 'Find the neighbour under the pointer, with a dead zone',
    says: ['This step is JavaScript alone, on purpose: where the pointer is, in table terms, is a ' +
      'walk over cumulative column widths — arithmetic on the chart, never elementFromPoint. A ' +
      'neighbour only yields once the pointer reaches its inner half: the outer quarter is a ' +
      'dead zone, without which the reorder oscillates when a wide column passes a narrow one. ' +
      'After a swap the pointer sits over the carried column itself — a no-op — so reversing ' +
      'means deliberately reaching the neighbour’s inner half again. Hysteresis, for free, ' +
      'from geometry.'],
    figure: <SlotsFigure/>,
    code: [
      {label: 'JS', lines: [
        plain('const struck = slots.find(({end}) => x < end);'),
        plain('const held = Math.max(struck.width / 4, (struck.width - aloftWidth) / 2);'),
        plain('const homeward = order.indexOf(struck.key) < order.indexOf(aloft);'),
        plain('return (homeward ? x < struck.end - held : x > struck.start + held)'),
        plain('  ? struck.key'),
        plain('  : undefined;')
      ]}
    ]
  },
  held(pace),
  shown(origin),
  moved(animated)
];

type Props = {
  pace: 'eager' | 'lazy';
  origin: 'keep' | 'hide';
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
      owned. Owned is not the same as scripted — every step below is the three languages working
      one behavior together: HTML holds the truth, CSS renders and moves it, JavaScript only
      decides. Each code block says which language is talking.
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
                {step.code.map(({label, lines}, at) => <Snippet label={label} lines={lines} key={at}/>)}
              </div>
            </div>
          </article>
        </li>)}
    </ol>
  </section>;
