import {FC, ReactNode} from 'react';
import * as D from 'schemawax';
import {Link} from 'react-router';
import {PillGlider} from '@components/PillGlider';
import {Picks} from '../Picks';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Motion, Origin, Pace} from '../../Controls';
import {StepEntry, StoryList, aside, plain} from '../../Recipe/StepList';
import {Mdn} from '../../Recipe/Mdn';
import {span, unit} from '../../Recipe/carve';
import {SlotsFigure} from './SlotsFigure';
import aloftSource from '@components/DragSortableTable/Aloft.tsx?raw';
import surveySource from '@components/DragSortableTable/survey.ts?raw';
import gripSource from '@components/DragSortableTable/RowGrip.tsx?raw';
import ghostSource from '@components/DragSortableTable/ghosts/Ghost.tsx?raw';
import sortableCss from '@components/DragSortableTable/sortable.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import ghostCss from '@components/DragSortableTable/ghosts/Ghost.css?raw';
import eksTable from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import eksHeader from '@components/DragSortableTable/EagerKeepStaticTable/Header.tsx?raw';
import eksHook from '@components/DragSortableTable/EagerKeepStaticTable/useColumnTravel.ts?raw';
import ekaTable from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.tsx?raw';
import ekaHeader from '@components/DragSortableTable/EagerKeepAnimatedTable/Header.tsx?raw';
import ekaHook from '@components/DragSortableTable/EagerKeepAnimatedTable/useColumnTravel.ts?raw';
import ehsTable from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import ehsHeader from '@components/DragSortableTable/EagerHideStaticTable/Header.tsx?raw';
import ehsHook from '@components/DragSortableTable/EagerHideStaticTable/useColumnTravel.ts?raw';
import ehaTable from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import ehaHeader from '@components/DragSortableTable/EagerHideAnimatedTable/Header.tsx?raw';
import ehaHook from '@components/DragSortableTable/EagerHideAnimatedTable/useColumnTravel.ts?raw';
import lksTable from '@components/DragSortableTable/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import lksHeader from '@components/DragSortableTable/LazyKeepStaticTable/Header.tsx?raw';
import lksHook from '@components/DragSortableTable/LazyKeepStaticTable/useColumnTravel.ts?raw';
import lkaTable from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import lkaHeader from '@components/DragSortableTable/LazyKeepAnimatedTable/Header.tsx?raw';
import lkaHook from '@components/DragSortableTable/LazyKeepAnimatedTable/useColumnTravel.ts?raw';
import lhsTable from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import lhsHeader from '@components/DragSortableTable/LazyHideStaticTable/Header.tsx?raw';
import lhsHook from '@components/DragSortableTable/LazyHideStaticTable/useColumnTravel.ts?raw';
import lhaTable from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import lhaHeader from '@components/DragSortableTable/LazyHideAnimatedTable/Header.tsx?raw';
import lhaHook from '@components/DragSortableTable/LazyHideAnimatedTable/useColumnTravel.ts?raw';
import ekaCss from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.css?raw';
import ehsCss from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.css?raw';
import ehaCss from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.css?raw';
import lkaCss from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.css?raw';
import lhsCss from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';
import lhaCss from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

type Sources = Record<Pace, Record<Origin, Record<Motion, string>>>;

const tableSources: Sources = {
  eager: {keep: {animated: ekaTable, static: eksTable}, hide: {animated: ehaTable, static: ehsTable}},
  lazy: {keep: {animated: lkaTable, static: lksTable}, hide: {animated: lhaTable, static: lhsTable}}
};

const headerSources: Sources = {
  eager: {keep: {animated: ekaHeader, static: eksHeader}, hide: {animated: ehaHeader, static: ehsHeader}},
  lazy: {keep: {animated: lkaHeader, static: lksHeader}, hide: {animated: lhaHeader, static: lhsHeader}}
};

const hookSources: Sources = {
  eager: {keep: {animated: ekaHook, static: eksHook}, hide: {animated: ehaHook, static: ehsHook}},
  lazy: {keep: {animated: lkaHook, static: lksHook}, hide: {animated: lhaHook, static: lhsHook}}
};

const cssSources: Record<Pace, Record<Origin, Partial<Record<Motion, string>>>> = {
  eager: {keep: {animated: ekaCss}, hide: {animated: ehaCss, static: ehsCss}},
  lazy: {keep: {animated: lkaCss}, hide: {animated: lhaCss, static: lhsCss}}
};

export type Track = 'pointer' | 'keyboard';

export const trackParam: D.Decoder<Track> = D.literalUnion('pointer', 'keyboard');

const animatedHeader = headerSources.eager.keep.animated;
const staticHeader = headerSources.eager.keep.static;
const animatedCss = cssSources.eager.keep.animated ?? '';

type Step = Omit<StepEntry, 'dial'> & {
  dial?: 'pace' | 'origin' | 'motion';
};

const held = (pace: 'eager' | 'lazy', hookSrc: string): Step => pace === 'eager'
  ? {
    title: 'Commit inside the move',
    dial: 'pace',
    want: 'The trader wants the table to answer inside the move, so that they can change their mind before the drop.',
    says: ['With eager pace, settle as soon as a neighbour is struck: the order state updates ' +
      'mid-drag, and because the markup renders through that order, the same key finds its new ' +
      'seat and React moves the real cells. Carrying the column back is just more crossings: ' +
      'home is always reachable. No style changes hands here at all.',
      'This is the whole eager hook’s handler, and there is no landing state to keep anywhere ' +
      'in it: buttons at zero heals a drag whose release was swallowed, the surface claims the ' +
      'pointer capture, the drift feeds the ghost, and a strike settles on the spot.'],
    code: [
      {label: 'JS', lines: [
        ...unit(hookSrc, 'const travel = ')
      ]},
      {label: 'HTML', lines: [
        plain('<DraggableHeader key={key} ... />'),
        aside('{/* same key, new seat: React moves the node, not a copy */}')
      ]}
    ]
  }
  : {
    title: 'Stash the landing, commit on release',
    dial: 'pace',
    want: 'The trader wants the table calm while they drag, because mid-flight churn distracts and only the destination matters.',
    says: ['With lazy pace, remember the last neighbour struck and do nothing else. The table ' +
      'holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot ' +
      'clears the landing, so a drop at home changes nothing.',
      'The lazy hook is its own handler, not a flag on the eager one: a strike is only ever ' +
      'remembered as the landing, and drop, which also answers cancel and a lost capture, ' +
      'commits it.'],
    code: [
      {label: 'JS', lines: [
        ...unit(hookSrc, 'const travel = '), gap,
        ...unit(hookSrc, 'const drop = ')
      ]}
    ]
  };

const shown = (origin: 'keep' | 'hide', source: string, headerSrc: string, cssSrc: string): Step => origin === 'hide'
  ? {
    title: 'Blank the origin while it is aloft',
    dial: 'origin',
    want: 'With the ghost in hand, the trader reads the origin column as a duplicate, and nothing says where the drop will land.',
    says: [<>We could unmount the origin while it travels, but its space would collapse and
      the whole table would shift; so the disappearance takes a component choice and one word
      of CSS instead. This is the hide table, so there is no flag anywhere: the markup compares the aloft key against each
      cell, and CSS does the
      vanishing: <Mdn path="Web/CSS/visibility">visibility</Mdn> hidden takes the whole column
      (text, borders, grip, everything) while its layout space remains as the gap where the
      drop will land. Nothing unmounts.</>],
    code: [
      {label: 'HTML', lines: [
        ...span(source, 'aloft={columnsTravel.aloft}', 'aloft={columnsTravel.aloft}'), gap,
        ...span(source, 'aloft={rowsTravel.aloft}', 'aloftColumn={columnsTravel.aloft}')
      ]},
      {label: 'JS', lines: [
        ...span(headerSrc, 'const hidden = aloft === columnName;', 'const hidden = aloft === columnName;'),
        aside('// being the hide table is the flag; the element serves itself')
      ]},
      {label: 'CSS', lines: [
        ...unit(cssSrc, '.sortable .hide,'),
        aside('/* the box stops painting; its layout space stays */')
      ]}
    ]
  }
  : {
    title: 'Leave the origin in place while it is aloft',
    dial: 'origin',
    want: 'A vanished origin can disorient; some traders want the column both at rest and in hand while they decide.',
    says: ['Render the lifted key normally underneath the ghost. There are two of it for the ' +
      'length of the drag, which reads as a copy being carried out of a still-intact table. ' +
      'This is the keep table: no hiding code exists in it, so there is nothing to erase.'],
    code: [
      {label: 'HTML', lines: [
        aside('{/* no hidden wiring exists in this table; nothing to erase */}')
      ]}
    ]
  };

const moved = (animated: boolean, source: string, cssSrc: string): Step => animated
  ? {
    title: 'Slide the theater, not the layout',
    dial: 'motion',
    want: 'The trader must be able to follow which column went where; a teleport is honest but unreadable, and animating the layout itself would bounce the whole table, because layout is load-bearing.',
    says: [
      <>A swap commits instantly: the carried column already sits at full width in its new
      slot, hidden or under the ghost, and the layout underneath is final. The displaced column
      is merely drawn where it used to be, sliding home on
      a <Mdn path="Web/CSS/transform">transform</Mdn>. Transforms cannot move layout, so nothing
      else can shift: a bounce is impossible by construction.</>,
      <>The three languages split the trick cleanly. JavaScript marks who was displaced and
      hands over two lengths it already owns, both measured by the survey: the carried
      column’s width and each row’s drop. The markup carries the mark as a class that arrives
      exactly as the reorder moves the node. CSS does all the moving:
      a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from is the old position, a pixel
      length the survey measured at the lift; applying the class starts the slide fresh,
      and <Mdn path="Web/API/Element/animationend_event">animationend</Mdn> hands the class
      back.</>,
      'Rows are the same theater turned vertical: heights measured once, in whatever event ' +
      'reorders them, become per-row pixel offsets, and every displaced row starts at ' +
      'translateY(var(--drop)) and slides home. Nothing in this table rides a view transition; ' +
      'every motion is a keyframe starting from where things used to be.',
      'Motion is not a flag on this table; it is this table. The animated variant marks its ' +
      'own theater inline in its settles, the dial above chooses which of eight tables you are ' +
      'reading, and the readout under the dials names it.'
    ],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'const settleColumn = '),
        aside('// a direction and a share per displaced key; javascript is done')
      ]},
      {label: 'HTML', lines: [
        plain("<th className={displaced && `displaced-${toward}`} ... >"),
        plain("<tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}>"),
        aside('{/* the reorder moves the node; the class rides along */}')
      ]},
      {label: 'CSS', lines: [
        ...unit(cssSrc, '.sortable .displaced {'), gap,
        ...unit(cssSrc, '.sortable .shifted {'), gap,
        ...unit(cssSrc, '@keyframes displaced'),
        aside('/* --toward flips the sign; direction is data, not a name */'), gap,
        ...unit(cssSrc, '@keyframes shifted')
      ]}
    ]
  }
  : {
    title: 'Apply the state update directly',
    dial: 'motion',
    want: 'Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.',
    says: ['The static table is not the animated one with a switch off; it is a different ' +
      'table with no marking code in it. Its settle is the whole story: move the key, let ' +
      'React paint, and there is nothing else, because nothing else exists in this file. ' +
      'There is real value in this mode beyond taste: nothing competes with the pointer, and ' +
      'no motion for prefers-reduced-motion users to endure.'],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'const settleColumn = '),
        aside('// the whole settle; no marking code exists in this table')
      ]}
    ]
  };

const vertical = (source: string): Step => ({
  title: 'Turn the theater vertical',
  want: 'A window is a row: the same carry on a second axis, and the hand needs something honest to hold.',
  says: ['Rows ride the machinery the columns built, with three substitutions. The grip is a ' +
    'real button, so the hand has a target and the keyboard will later get one free. The ' +
    'survey learns row heights at lift, measured once like everything else. And cardUnder ' +
    'answers which seat sits under the pointer, columnUnder turned vertical. Two more words: ' +
    'the seats are the seating chart, the rows’ order, and a card is one row’s identity. The ' +
    'settle is the same story: the moved card takes its new seat, and the rest ride along.'],
  code: [
    {label: 'HTML', lines: [
      ...span(gripSource, '<button', '</button>'),
      aside('{/* focusable by birth; the keyboard track will thank us */}')
    ]},
    {label: 'JS', lines: [
      ...unit(surveySource, 'export const cardUnder'), gap,
      ...unit(source, 'const settleRow = ')
    ]}
  ]
});


type Tale = {can: string; soThat: string; tells?: ReactNode[]; steps: Step[]};

const pointerStories = (pace: Pace, origin: Origin, motion: Motion): Tale[] => {
  const source = tableSources[pace][origin][motion];
  const headerSrc = headerSources[pace][origin][motion];
  const hookSrc = hookSources[pace][origin][motion];
  const cssSrc = cssSources[pace][origin][motion] ?? '';
  const mechanics: Step[] = [
  {
    title: 'Let CSS carry its share',
    want: 'Whatever the trader arrives with (mouse, touchscreen, keyboard), the platform’s manners come first: cursors that offer the hand, touch that drags, selections that never smear mid-drag.',
    says: [
      <>The markup stays honest HTML, a real table with real headers, so the semantics come
      free: the row grip is a button that reorders rows from the arrow keys without a line of
      drag code, and the resize handle is
      a real <Mdn path="Web/HTML/Element/button">button</Mdn> that announces itself by
      name, and its share once the ledger exists.</>,
      <>CSS carries more of the effect than it appears: the open hand and the closed fist
      are <Mdn path="Web/CSS/cursor">cursors</Mdn>, <Mdn path="Web/CSS/touch-action">touch-action</Mdn>:
      none is the single line that lets pointer events drag on a touchscreen,
      and <Mdn path="Web/CSS/user-select">user-select</Mdn>: none keeps a fast drag from sweeping
      text selections. JavaScript is left holding only what neither can: one measurement, some
      arithmetic, and the order.</>
    ],
    code: [
      {label: 'HTML', lines: [
        plain('<table><thead><tr><th scope="col">window</th> ...'),
        plain('<button className="grip" aria-label="move row 2"><Handle/></button>'),
        plain('<button className="resize-handle" aria-label="resize trades, 24%"/>')
      ]},
      {label: 'CSS', lines: [
        ...unit(sortableCss, '.grabbable {'), gap,
        ...unit(sortableCss, '.sortable {')
      ]},
      {label: 'JS', lines: [
        aside('// one measurement, slot arithmetic, and the order; nothing else')
      ]}
    ]
  },
  {
    title: 'Keep the order in state, not in the data',
    want: 'Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.',
    says: ['Rows and columns arrive in whatever order the fold produced. Hold the ordered ' +
      'columns and the seats as state, and render the markup through them, so a reorder never ' +
      'touches the data: the same key finds its new seat and React moves the real nodes.'],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'const [ordered, setOrdered]'), gap,
        ...unit(source, 'const [seats, setSeats]')
      ]},
      {label: 'HTML', lines: [
        plain('<tr>{order.map(key =>'),
        plain('    <DraggableHeader key={key} column={byKey.get(key)} ... />)}</tr>')
      ]}
    ]
  },
  {
    title: 'Lift on pointer down, and measure the table once',
    want: 'A carry must know the ground it stands on without asking the DOM again on every twitch of the hand.',
    says: [<>The hand is CSS before anything happens, grab on hover, grabbing on press, and
      touch-action: none is why the pointer can drag on touch at all. On pointerdown,
      JavaScript records which key is aloft and measures the
      table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn>, and every
      header in it, a single time: the survey. Everything that follows is math against the survey; measuring per move
      would fight the reorder you are about to apply.</>,
      <>Three words you will see in every block from here. Aloft is whatever you are
      carrying, named by its key. The survey is a plain record of that one measurement: the
      table’s box, each column’s width, and later the row heights. And has is this site’s null check, from a small
      library called <a className="signpost"
        href="https://ryandur.github.io/sand/"
        target="_blank"
        rel="noreferrer">sand</a>; it answers false for nothing and for empty.</>],
    code: [
      {label: 'JS', lines: [
        ...unit(hookSrc, 'const lift = '), gap,
        ...span(source, 'onLift={columnsTravel.lift}', 'onLift={columnsTravel.lift}')
      ]},
      {label: 'CSS', lines: [
        ...unit(sortableCss, '.grabbable {')
      ]}
    ]
  },
  {
    title: 'Give the drag a surface of its own',
    want: 'The carry outruns the header it grabbed: the pointer leaves the element mid-drag, and the release can land anywhere, even outside the window.',
    says: ['Your first surface is the document: add two listeners at lift, remove them at drop. ' +
      'Now travel is running against the order as it stood when the drag began, and every path ' +
      'out of the drag owes you a cleanup.',
      <>While something is aloft, the markup grows a fixed, full-viewport element carrying
      the move and drop handlers. Because React re-renders it on every settle, the handlers are
      always fresh: no stale closures, no document listeners. CSS gives it the grabbing cursor
      and, by mere existence, it blocks hover styles beneath it, with no state and no
      class-toggling. Hold <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on
      it, and treat <Mdn path="Web/API/Element/lostpointercapture_event">losing the capture</Mdn> as
      the drop: releases can vanish into odd corners of the platform, and the capture going
      away is the one signal that always arrives.</>],
    code: [
      {label: 'JS', foil: true, lines: [
        plain("document.addEventListener('pointermove', travel);"),
        plain("document.addEventListener('pointerup', drop);"), gap,
        aside('// travel closed over the order at lift time, and every'),
        aside('// path out of the drag owes a removeEventListener')
      ]},
      {label: 'HTML', lines: [
        ...span(aloftSource, '(has(columnsTravel.aloft) || has(rowsTravel.aloft))', '{...surface}')
      ]},
      {label: 'JS', lines: [
        ...span(hookSrc, 'onPointerMove: travel', 'onLostPointerCapture: drop'), gap,
        ...unit(hookSrc, 'const drop = '),
        aside('// cancel and lost capture are not delegates; they ARE the drop')
      ]},
      {label: 'CSS', lines: [
        ...unit(sortableCss, '.drag-surface {'),
        aside('/* hover below is blocked by existence */')
      ]}
    ]
  },
  {
    title: 'Draw the ghost by hand',
    want: 'The carried column has to be visible in the hand, smoothly, on slow machines too.',
    says: [<>The column in your hand is not a clone of DOM nodes. It is a second table rendered
      from the same data. The flight is where you grabbed it; the drift is how far you have
      moved since; both are state, and the ghost renders at the flight, translated by the
      drift. Each pointer move sets the drift and React paints the translation; CSS keeps the
      ghost out of hit-testing with <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none
      and promises the browser motion with <Mdn path="Web/CSS/will-change">will-change</Mdn>.
      Nothing is measured per move, which is what keeps slower engines smooth.</>],
    code: [
      {label: 'HTML', lines: [
        ...span(ghostSource, 'export const Ghost', '</table>;'),
        aside('{/* the same cells, rendered again from the data */}')
      ]},
      {label: 'JS', lines: [
        ...span(hookSrc, 'setDrift({x: event.clientX - origin.x',
          'setDrift({x: event.clientX - origin.x')
      ]},
      {label: 'CSS', lines: [
        ...unit(ghostCss, '.column-ghost {')
      ]}
    ]
  },
  {
    title: 'Find the neighbour under the pointer, with a dead zone',
    want: 'A drift along a boundary must not chatter the order under the hand.',
    says: [<>This step is JavaScript alone, on purpose: where the pointer is, in table terms,
      is a walk over cumulative column widths: arithmetic on the survey,
      never <Mdn path="Web/API/Document/elementFromPoint">elementFromPoint</Mdn>. A{' '}
      neighbour only yields once the pointer reaches its inner half: the outer quarter is a
      dead zone, without which the reorder oscillates when a wide column passes a narrow one.
      After a swap the pointer sits over the carried column itself, a no-op, so reversing
      means deliberately reaching the neighbour’s inner half again. Hysteresis, for free,
      from geometry.</>],
    figure: <SlotsFigure/>,
    code: [
      {label: 'JS', lines: [
        ...unit(surveySource, 'const deadZone = '), gap,
        ...unit(surveySource, 'export const columnUnder')
      ]}
    ]
  }
  ];
  return [
    {can: 'The trader can sort by column',
      soThat: 'the measures they compare sit beside each other',
      tells: [<>There are two roads to dragging something across a page, and this site walks
        both. The <Link className="signpost"
        to={`${Paths.demos}?tab=${DemoTopics.dragAndDrop}`}>Drag sort list demo</Link> takes
        the native API, where the platform brings most of the behavior for very little code;
        its edges (the snapshot that cannot be animated, the cursor that belongs to the
        platform, the macOS cancel) are that road’s own story. This table takes the other
        road: <Mdn path="Web/API/Pointer_events">pointer events</Mdn>, where every pixel is
        ours to own.</>,
        'The trader needs to move a column while the stream writes. We could reorder ' +
        'the data itself, but every trade that lands would fight every drag; so the order is ' +
        'its own piece of state, and the markup renders through it. Moving a column is just ' +
        'changing the order. We could ask the DOM where everything is as the pointer moves, ' +
        'but layout queries during a drag cause the jank we are trying to avoid; so ' +
        'everything the drag needs gets measured once, when you grab.',
        <>And owning the pixels does not mean building in JavaScript. The markup stays a
        normal table; every visible change (the cursors, the hiding, every slide) is a CSS
        rule a class switches on; JavaScript only decides what the state is, and React
        affords nothing the DOM does not give you: the node moves
        are <Mdn path="Web/API/Node/insertBefore">insertBefore</Mdn>, the handlers are
        events, the state is a value. Each code block below is labeled with which of the
        three languages is doing the work.</>,
        'This particular table keeps three more promises. ' + (pace === 'eager'
          ? 'The sort happens while you drag, so a wrong grab costs nothing. '
          : 'The table holds calm and the sort lands on the drop, so only the destination matters. ') +
        (origin === 'hide'
          ? 'A gap opens where the column left, so the landing is never a guess. '
          : 'The column stays in sight while its copy travels, so nothing vanishes while you decide. ') +
        (motion === 'animated'
          ? 'And the swap slides into place, so the eye never loses a column.'
          : 'And the swap lands instantly, with no motion, so nothing competes with the pointer.')],
      steps: [...mechanics,
        held(pace, hookSrc),
        shown(origin, source, headerSrc, cssSrc),
        moved(motion === 'animated', source, cssSrc)]},
    {can: 'The trader can sort by row',
      soThat: 'the windows they watch closest sit on top',
      tells: ['We could build rows their own machinery, but the need is the same motion ' +
        'turned vertical; so rows ride what the columns built. The differences that remain ' +
        'are honest ones: a grip button to grab, row heights in the survey, and a vertical ' +
        'hit test. The promises the dials set ride along unchanged; the turn changes the ' +
        'axis, nothing else.'],
      steps: [vertical(source)]}
  ];
};

const nudgedBoth = (animated: boolean): Step => animated
  ? {
    title: 'Both parties slide, each by the other’s share',
    dial: 'motion',
    want: 'A pointer swap explains itself with a ghost in hand; the trader’s keyboard swap has no hand, and if only the neighbour slid, the walked column would simply teleport.',
    says: ['Mark both columns displaced. The swap still commits instantly, the same theater ' +
      'the pointer track built, but now each party is drawn starting from the seat it just ' +
      'left, offset by the other’s share, sliding home on the same keyframes. The classes ' +
      'arrive as the reorder moves the nodes, so both slides start fresh without a line of new CSS.'],
    code: [
      {label: 'JS', lines: [
        ...span(animatedHeader, 'const neighbour = order[to];', '});'),
        aside('// each starts where the other now sits')
      ]},
      {label: 'CSS', lines: [
        ...unit(animatedCss, '.sortable .displaced {'),
        aside('/* the pointer track’s keyframe, unchanged; --toward flips the sign */')
      ]}
    ]
  }
  : {
    title: 'Cut on the keypress',
    dial: 'motion',
    want: 'Motion is not free, a held key multiplies it, and some traders ask for none at all.',
    says: ['Apply the order and mark nothing; the swap paints on the next frame. With no ' +
      'animation running there is nothing to pace, so a held arrow walks the column exactly as ' +
      'fast as the key repeats.'],
    code: [
      {label: 'JS', lines: [
        ...span(staticHeader, 'const from = order.indexOf(columnName);', 'onOrdered(columnName, to);'),
        aside('// the whole walk; nothing marked, nothing to wait for')
      ]}
    ]
  };

const keyedStories = (motion: Motion): Tale[] => {
  const headerSrc = headerSources.eager.keep[motion];
  const steps: Step[] = [
  {
    title: 'Give focus a place to land',
    want: 'The trader without a pointer expects the same reorders, and first, focus needs a place to land; a plain header holds none.',
    says: [<>HTML nearly solves this alone: the row grip is a button, focusable by birth, and
      the headers ask for focus with
      a <Mdn path="Web/HTML/Global_attributes/tabindex">tabIndex</Mdn>, so Tab walks every
      movable piece of the table in order. CSS answers the arrival with
      a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
      only; pointer users never see it.</>],
    code: [
      {label: 'HTML', lines: [
        ...span(staticHeader, 'tabIndex={travels', 'tabIndex={travels'), gap,
        ...span(gripSource, '<button', '</button>'),
        aside('{/* the button was focusable all along; the header asks */}')
      ]},
      {label: 'CSS', lines: [
        ...unit(headerCss, '.sortable .slot {')
      ]}
    ]
  },
  {
    title: 'Arrows speak direction',
    want: 'The trader’s focus can reach a column, but the platform ships no verb for “swap left”; they need one.',
    says: [<>A <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> handler claims the two
      arrows and nothing else, so every other key falls through untouched and tabbing and the
      sort menu keep
      working; <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> stops the page
      from scrolling on the keys it does claim. The walk clamps inside the anchored
      edges: the first and last columns hold the table, so the nudge stops beside them, and
      rows do the same dance turned vertical, the grip listening for up and down.</>],
    code: [
      {label: 'JS', lines: [
        ...unit(headerSrc, 'onKeyDown={travels'),
        aside('// the anchors hold; the walk stops beside them')
      ]}
    ]
  },
  nudgedBoth(motion === 'animated'),
  ...motion === 'animated'
    ? [{
      title: 'Let the slide pace the key',
      want: 'The trader holds the arrow, and autorepeat must not outrun the slide: nudges landing mid-flight would outrun the theater.',
      says: ['The reflex is a timer: block the keys for however long the slide takes, and hope ' +
        'the number matches the CSS.',
        <>There are no timers in this step: before nudging, ask the element whether an
        animation is still
        running; <Mdn path="Web/API/Element/getAnimations">getAnimations</Mdn> is the platform’s
        own record of the slide. While one runs, the key falls silent; the moment it ends, the
        next repeat lands. The animation is the debounce clock, and CSS already set its
        length.</>],
      code: [
        {label: 'JS', lines: [
          ...span(animatedHeader, 'if ((event.currentTarget.getAnimations', '}'),
          aside('// while the slide runs, the key falls silent')
        ]},
        {label: 'CSS', lines: [
          ...unit(animatedCss, '.sortable .displaced {'),
          aside('/* the 200ms IS the debounce interval */')
        ]}
      ]
    } satisfies Step]
    : []
  ];
  return [{can: 'The trader can sort without a mouse',
    soThat: 'the table answers whoever arrives at it',
    tells: ['We could build the keyboard its own sorting system, but the state, the clamps, ' +
      'and the slides already exist; so this track is about access. Focus reaches every grip ' +
      'and every header, and two arrow keys get everything the hand has.'],
    steps}];
};

type Props = {
  track: Track;
  onTrack: (track: Track) => void;
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onPace: (pace: Pace) => void;
  onOrigin: (origin: Origin) => void;
  onMotion: (motion: Motion) => void;
};

export const Recipe: FC<Props> = ({track, onTrack, pace, origin, motion, onPace, onOrigin, onMotion}) => {
  const dials = {
    pace: <PillGlider label="pace"
                      name="step-pace"
                      options={[
                        {display: 'Eager', value: 'eager'},
                        {display: 'Lazy', value: 'lazy'}
                      ]}
                      chosen={pace}
                      onChoose={onPace}/>,
    origin: <PillGlider label="origin"
                        name="step-origin"
                        options={[
                          {display: 'Keep', value: 'keep'},
                          {display: 'Hide', value: 'hide'}
                        ]}
                        chosen={origin}
                        onChoose={onOrigin}/>,
    motion: <PillGlider label="motion"
                        name="step-motion"
                        options={[
                          {display: 'Animate', value: 'animated'},
                          {display: 'Static', value: 'static'}
                        ]}
                        chosen={motion}
                        onChoose={onMotion}/>
  };
  return <section aria-label="build the drag sort yourself" className="build-steps">
    <header className="brief-line">
      <h2 className="kicker">build the drag sort yourself</h2>
      <p className="brief">
        Everything below is built without a drag-and-drop library and told as its stories:
        what the trader can do, and why, then the features each story demands. Take the
        pointer’s track or the keyboard’s.
        Wherever a step depends on a dial under the table, that dial sits on the step. Where
        there is a wrong way you would reach for first, it appears in a dashed frame before
        the real one.
      </p>
    </header>
    <Picks label="input track"
           className="track-picks"
           options={[
             {display: 'By pointer', value: 'pointer'},
             {display: 'By keyboard', value: 'keyboard'}
           ]}
           chosen={track}
           onPick={onTrack}/>
    {track === 'pointer' ? <>
    </> : <>
    <p className="lead">
      It turns out to need almost nothing new: the state, the clamps, and the theater all
      exist, so this track is about letting focus reach them and letting two keys speak.
    </p>
    <p className="lead">
      Two of the dials go quiet here: pace and origin describe a drag session, what happens
      while something is held aloft, and a keyboard nudge holds nothing aloft. Only motion
      still chooses, and the marked step below is written the way that dial sits.
    </p>
    </>}
    <StoryList stories={(track === 'pointer'
      ? pointerStories(pace, origin, motion)
      : keyedStories(motion))
      .map(story => ({...story,
        steps: story.steps.map(({dial, ...step}) => ({...step, dial: dial && dials[dial]}))}))}/>
  </section>;
};
