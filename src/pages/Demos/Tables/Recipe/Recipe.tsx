import {FC} from 'react';
import {DragStyle} from '@components/DragSortableTable';
import {CodeBlock} from './CodeBlock';
import {SlotsFigure} from './SlotsFigure';
import {LayersFigure} from './LayersFigure';
import './Recipe.css';

const liftCode = `const liftColumn = (key: string) => (event: PointerEvent) => {
  const table = event.currentTarget.closest('table');
  setChart(charted(table));   // one getBoundingClientRect, kept in state
  columnsTravel.lift(key, event.currentTarget)(event);
};`;

const surfaceCode = `{aloft &&
  <article className="drag-surface"   /* position: fixed; inset: 0 */
           onPointerMove={travel}
           onPointerUp={drop}
           onLostPointerCapture={drop}/>}`;

const ghostCode = `<table className="column-ghost"
       style={{position: 'fixed', top: at.y, left: at.x,
               width: at.width, pointerEvents: 'none',
               willChange: 'transform'}}>
  {/* the same cells, rendered again from the data */}
</table>

// each move is one transform — nothing is measured
ghost.style.transform =
  \`translate(\${x - from.x}px, \${y - from.y}px)\`;`;

const strikeCode = `const columnUnder = (chart, order, shares) => (x, aloft) => {
  let edge = chart.left;
  const slots = order.map(key => {
    const width = shares[key] / 100 * chart.width;
    edge += width;
    return {key, start: edge - width, end: edge, width};
  });
  const struck = slots.find(({end}) => x < end);
  if (!struck || struck.key === aloft) return struck?.key;
  const held = struck.width / 4;   // the dead zone
  const homeward = order.indexOf(struck.key) < order.indexOf(aloft);
  return (homeward ? x < struck.end - held : x > struck.start + held)
    ? struck.key
    : undefined;
};`;

const eagerCode = `// called straight from the surface's onPointerMove
const settle = (aloft, struck) =>
  setOrder(previous =>
    moveToIndex(previous.indexOf(struck), aloft, previous));`;

const lazyCode = `// crossings only remember; pointerup commits
if (struck === aloft) landing.current = null;   // home — forget it
else landing.current = struck;

const drop = () =>
  landing.current && settle(aloft, landing.current);`;

const hideCss = `.sortable .hide { color: transparent; }
.fancy-table.sortable .hide { border-bottom-color: transparent; }
/* the hidden lane keeps only its right edge */`;

const staticCode = `setOrder(next);   // React paints the new order in place — done`;

const animatedCode = `const move = (update) =>
  'startViewTransition' in document
    ? document.startViewTransition(() => flushSync(update))
    : update();   // no support — land static, no ceremony`;

const namesCode = `<th style={{viewTransitionName:
    aloft === key ? undefined : \`header-\${key}\`}}>

/* the ghost joins the overlay and refuses to animate */
::view-transition-group(ghost) { z-index: 1; animation: none; }
::view-transition-old(ghost) { display: none; }`;

type Settling = {
  title: string;
  lead: string;
  code: string;
  hides: boolean;
};

const settling: Record<DragStyle, Settling> = {
  'eager-move': {
    title: 'Settle eagerly',
    lead: 'Eager settles mid-flight: commit the reorder on every crossing, straight from the move ' +
      'handler. Keyed rendering moves the real cells; the surface re-renders with them, so its ' +
      'handlers never close over a stale order. Carrying the column back is just more crossings — ' +
      'home is always reachable.',
    code: eagerCode,
    hides: false
  },
  'lazy-move': {
    title: 'Settle lazily',
    lead: 'Lazy holds its fire: remember the crossing as a landing, and commit once, on pointerup. ' +
      'Drifting back over your own slot clears the landing, so a drop at home changes nothing.',
    code: lazyCode,
    hides: false
  },
  'hide-eager-move': {
    title: 'Settle eagerly, travel hidden',
    lead: 'Hide Eager settles mid-flight: commit the reorder on every crossing, straight from the ' +
      'move handler. The carried column also paints itself out while aloft — no unmounting, just CSS ' +
      'making its text and rules transparent while the lane keeps its right edge.',
    code: eagerCode,
    hides: true
  },
  'hide-lazy-move': {
    title: 'Settle lazily, travel hidden',
    lead: 'Hide Lazy holds its fire: remember the crossing as a landing, and commit once, on ' +
      'pointerup. The carried column paints itself out while aloft — no unmounting, just CSS making ' +
      'its text and rules transparent while the lane keeps its right edge.',
    code: lazyCode,
    hides: true
  }
};

type Props = {
  dragStyle: DragStyle;
  animated: boolean;
};

export const Recipe: FC<Props> = ({dragStyle, animated}) => {
  const settle = settling[dragStyle];
  return <section aria-label="how to build this" className="drag-recipe card">
    <h2 className="headline">Build it yourself</h2>
    <p className="lead">
      Skip native drag and drop — its drag image, its cursors, and its drop rules belong to the
      platform, and half of them cannot be styled. This table is dragged with pointer events, and
      every pixel of the interaction is owned. The dials above change how it settles and how it
      moves; this article changes with them.
    </p>

    <h3 className="step">Lift: measure once, then trust arithmetic</h3>
    <p className="explanation">
      On pointerdown over a header (or a row&apos;s grip), measure the table&apos;s bounding rect a
      single time and keep it in state — call it the chart. Everything that follows is math against
      the chart; the DOM is never asked where things are again.
    </p>
    <CodeBlock code={liftCode}/>

    <h3 className="step">The surface: a full-viewport listener that re-renders</h3>
    <p className="explanation">
      While something is aloft, render a fixed, full-viewport element and give it the move and drop
      handlers. Because React re-renders it on every settle, the handlers are always fresh — no stale
      closures, no document listeners — and it physically blocks hover styles beneath it for free.
      Hold pointer capture on it, and treat losing the capture as the drop: releases can vanish into
      odd corners of the platform, and the capture going away is the one signal that always arrives.
    </p>
    <CodeBlock code={surfaceCode}/>

    <h3 className="step">The ghost: render the data again, move a transform</h3>
    <p className="explanation">
      The column in your hand is not a clone of DOM nodes — it is a second table rendered from the
      same data, fixed at the lift point. Each pointer move applies one transform; nothing is
      measured per move, which is what keeps slower engines smooth.
    </p>
    <CodeBlock code={ghostCode}/>

    <h3 className="step">The strike: slot math with a dead zone</h3>
    <p className="explanation">
      Where the pointer is, in table terms, is a walk over cumulative column widths — arithmetic on
      the chart, not elementFromPoint. A neighbor only yields once the pointer reaches its inner
      half: the outer quarter is a dead zone, which is what stops the order from chattering back and
      forth at a boundary. After a swap the pointer sits over the carried column itself — a no-op —
      so reversing means deliberately reaching the neighbor&apos;s inner half again. Hysteresis, for
      free, from geometry.
    </p>
    <SlotsFigure/>
    <CodeBlock code={strikeCode}/>

    <h3 className="step">{settle.title}</h3>
    <p className="explanation">{settle.lead}</p>
    <CodeBlock code={settle.code}/>
    {settle.hides && <CodeBlock code={hideCss}/>}

    <h3 className="step">{animated ? 'Motion: let the platform glide it' : 'Motion: none, and that is a feature'}</h3>
    {animated
      ? <>
        <p className="explanation">
          The settle runs inside document.startViewTransition with flushSync, and every cell wears a
          view-transition-name. The browser animates whatever geometry changed between the two
          states — and because the carried column sheds its name while aloft, the only thing that
          ever changes is the neighbor whose space is being overtaken. One element glides; everything
          else holds still.
        </p>
        <CodeBlock code={animatedCode}/>
        <p className="explanation">
          Two traps worth knowing. Transition groups paint in the browser&apos;s top layer, above
          even a fixed-position ghost — so the ghost must join the overlay under its own name,
          unanimated and z-ordered on top. And a transition&apos;s capture phase can swallow a
          pointerup outright, which is why the surface holds pointer capture and treats
          lostpointercapture as the drop.
        </p>
        <LayersFigure/>
        <CodeBlock code={namesCode}/>
      </>
      : <>
        <p className="explanation">
          Static is a plain state update: the settle commits, React renders the new order in place,
          and nothing else moves. There is real value in this mode beyond taste — no animation means
          nothing competes with the pointer, no overlay to swallow events, no motion for
          prefers-reduced-motion users to endure. Flip the dial to Animate to see what the platform
          adds, and what it costs.
        </p>
        <CodeBlock code={staticCode}/>
      </>}
  </section>;
};
