import {FC} from 'react';
import {join} from '@components/class-names';
import {Origin, Pace} from '../Controls';
import {Line, Snippet} from './Snippet';
import './Recipe.css';

type Step = {
  title: string;
  says: string;
  tuned?: boolean;
  code: Line[];
};

const plain = (text: string): Line => ({text});
const aside = (text: string): Line => ({text, dim: true});

const held = (pace: Pace): Step => pace === 'eager'
  ? {
    title: 'Commit inside the move',
    tuned: true,
    says: 'With eager pace, settle as soon as a neighbour is struck. The list reorders under the ' +
      'pointer, so what you see during the drag is already the result.',
    code: [
      plain('onPointerMove: event => {'),
      plain('  const struck = strike(event.clientX, event.clientY, aloft);'),
      plain('  if (has(aloft) && has(struck) && struck !== aloft)'),
      plain('    settle(aloft, struck);'),
      plain('}')
    ]
  }
  : {
    title: 'Stash the landing, commit on release',
    tuned: true,
    says: 'With lazy pace, remember the last neighbour struck and do nothing else. The table holds ' +
      'still, and one moveToIndex runs on pointer up.',
    code: [
      plain('onPointerMove: event => {'),
      plain('  const struck = strike(event.clientX, event.clientY, aloft);'),
      plain('  landing.current = struck === aloft ? null : struck;'),
      plain('},'),
      plain('onPointerUp: () => {'),
      plain('  if (has(aloft) && has(landing.current))'),
      plain('    settle(aloft, landing.current);'),
      plain('}')
    ]
  };

const shown = (origin: Origin): Step => origin === 'hide'
  ? {
    title: 'Blank the origin while it is aloft',
    tuned: true,
    says: 'Pass a hiding flag down and drop the lifted key out of the header and every row. Only ' +
      'the ghost reads as real, and the gap shows exactly where the drop will land.',
    code: [
      plain('const hiding = style.startsWith("hide-");'),
      plain('<DraggableHeader hidden={hiding && aloft === key} ... />'),
      plain('<DraggableRow hiddenColumn={hiding ? aloft : undefined} ... />')
    ]
  }
  : {
    title: 'Leave the origin in place while it is aloft',
    tuned: true,
    says: 'Render the lifted key normally underneath the ghost. There are two of it for the length ' +
      'of the drag, which reads as a copy being carried out of a still-intact table.',
    code: [
      plain('const hiding = style.startsWith("hide-");  // false here'),
      plain('<DraggableHeader hidden={false} ... />'),
      aside('// the lifted cells keep rendering in their seats')
    ]
  };

const moved = (animated: boolean): Step => animated
  ? {
    title: 'Wrap the state update in a view transition',
    tuned: true,
    says: 'Name every cell that survives the reorder, then run the setState inside ' +
      'startViewTransition with flushSync so the browser captures before and after in one frame. ' +
      'The cells tween themselves.',
    code: [
      plain('const glide = animated => update => {'),
      plain('  document.startViewTransition(() => flushSync(update));'),
      plain('};'),
      aside('// style={{viewTransitionName: `header-${key}`}}')
    ]
  }
  : {
    title: 'Apply the state update directly',
    tuned: true,
    says: 'Call the updater and let React paint. No names, no transition, no flushSync — the new ' +
      'order is on screen in the next frame.',
    code: [
      plain('const glide = animated => update => {'),
      plain('  update();'),
      plain('};')
    ]
  };

const steps = (pace: Pace, origin: Origin, animated: boolean): Step[] => [
  {
    title: 'Keep the order in state, not in the data',
    says: 'Rows and columns arrive in whatever order the fold produced. Hold a separate list of ' +
      'keys and seats, and render through it, so a reorder never touches the data.',
    code: [
      plain('const [order, setOrder] = useState(() =>'),
      plain('  columns.map(({column}) => String(column)));'),
      plain('const [seats, setSeats] = useState(() =>'),
      plain('  rows.map((_, seat) => seat));'),
      aside('// render: order.map(key => byKey.get(key))')
    ]
  },
  {
    title: 'Lift on pointer down, and measure the table once',
    says: 'Record which key is aloft and snapshot the table geometry at that instant. Measuring ' +
      'per move would fight the reorder you are about to apply.',
    code: [
      plain('const lift = (key, anchor) => () => {'),
      plain('  setChart(charted(anchor.closest("table"), arranged));'),
      plain('  setFlight(anchor.getBoundingClientRect());'),
      plain('  setAloft(key);'),
      plain('};')
    ]
  },
  {
    title: 'Draw the ghost by hand',
    says: 'Clone the lifted column or row into a fixed-position table and translate it by the ' +
      'pointer delta. Writing transform straight to the node keeps it off the React render path.',
    code: [
      plain('ghost.current?.style.setProperty("transform",'),
      plain('  `translate(${x - origin.x}px, ${y - origin.y}px)`);')
    ]
  },
  {
    title: 'Find the neighbour under the pointer, with a dead zone',
    says: 'Walk the measured slots and take the one the pointer is inside. Require it to be ' +
      'crossed by a quarter of its own size, or the reorder oscillates when a wide column passes ' +
      'a narrow one.',
    code: [
      plain('const deadZone = (struck, aloft) =>'),
      plain('  Math.max(struck / 4, (struck - aloft) / 2);'),
      aside('// struck.at < home ? x < end - held : x > start + held')
    ]
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
        Seven steps, no library. Steps marked <em className="chip">set above</em> are written the
        way the controls are currently set.
      </p>
    </header>
    <ol className="steps">
      {steps(pace, origin, animated).map(step =>
        <li className={join('step', step.tuned && 'tuned')} key={step.title}>
          <h3 className="step-title">
            {step.title}
            {step.tuned && <em className="chip">set above</em>}
          </h3>
          <p className="step-says">{step.says}</p>
          <Snippet lines={step.code}/>
        </li>)}
    </ol>
  </section>;
