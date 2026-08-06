import {FC} from 'react';
import * as D from 'schemawax';
import {Link} from 'react-router';
import {PillGlider} from '@components/PillGlider';
import {Picks} from '../Picks';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Motion, Origin, Pace} from '../../Controls';
import {StepEntry, StepList, aside, plain} from '../../Recipe/StepList';
import {span, unit} from '../../Recipe/carve';
import {SlotsFigure} from './SlotsFigure';
import tableSource from '@components/DragSortableTable/SortingTable.tsx?raw';
import theaterSource from '@components/DragSortableTable/theater.ts?raw';
import stillShell from '@components/DragSortableTable/DragSortableTable.tsx?raw';
import stagedShell from '@components/DragSortableTable/AnimatedDragSortableTable.tsx?raw';
import travelSource from '@components/DragSortableTable/useTravel.ts?raw';
import chartSource from '@components/DragSortableTable/chart.ts?raw';
import headerSource from '@components/DragSortableTable/DraggableHeader.tsx?raw';
import gripSource from '@components/DragSortableTable/RowGrip.tsx?raw';
import ghostSource from '@components/DragSortableTable/ghosts/Ghost.tsx?raw';
import tableCss from '@components/DragSortableTable/DragSortableTable.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain('');

export type Track = 'pointer' | 'keyboard';

export const trackParam: D.Decoder<Track> = D.literalUnion('pointer', 'keyboard');

type Step = Omit<StepEntry, 'dial'> & {
  dial?: 'pace' | 'origin' | 'motion';
};

const held = (pace: 'eager' | 'lazy'): Step => pace === 'eager'
  ? {
    title: 'Commit inside the move',
    dial: 'pace',
    want: 'You want the table to answer the hand immediately; waiting for the drop hides the outcome until it is too late to change your mind.',
    says: ['With eager pace, settle as soon as a neighbour is struck — the order state updates ' +
      'mid-drag, and because the markup renders through that order, the same key finds its new ' +
      'seat and React moves the real cells. Carrying the column back is just more crossings: ' +
      'home is always reachable. No style changes hands here at all.',
      'This is the real handler, not a sketch — buttons at zero heals a drag whose release was ' +
      'swallowed, the surface claims the pointer capture, the drift feeds the ghost — and the ' +
      'eager fork settles the strike the moment it lands.'],
    code: [
      {label: 'JS', lines: [
        ...unit(travelSource, 'const travel = ')
      ]},
      {label: 'HTML', lines: [
        plain('<DraggableHeader key={key} ... />'),
        aside('{/* same key, new seat — React moves the node, not a copy */}')
      ]}
    ]
  }
  : {
    title: 'Stash the landing, commit on release',
    dial: 'pace',
    want: 'You want the table calm while you drag, because mid-flight churn distracts and only the destination matters.',
    says: ['With lazy pace, remember the last neighbour struck and do nothing else — the table ' +
      'holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot ' +
      'clears the landing, so a drop at home changes nothing.',
      'Same handler, other fork: the strike is only remembered as the landing, and drop — ' +
      'which also answers cancel and a lost capture — commits it.'],
    code: [
      {label: 'JS', lines: [
        ...unit(travelSource, 'const travel = '), gap,
        ...unit(travelSource, 'const drop = ')
      ]}
    ]
  };

const shown = (origin: 'keep' | 'hide'): Step => origin === 'hide'
  ? {
    title: 'Blank the origin while it is aloft',
    dial: 'origin',
    want: 'With the ghost in hand, the origin column reads as a duplicate — two of the same thing, and no visible gap to say where the drop will land.',
    says: ['The disappearance takes all three languages. JavaScript knows only a boolean — the origin dial ' +
      'is already the flag, derived by comparison. The markup passes it down as a class on the ' +
      'lifted key’s cells. CSS does the vanishing with a single word: visibility hidden takes ' +
      'the whole column — text, borders, grip, everything — while its layout space remains as ' +
      'the gap where the drop will land. Nothing unmounts.'],
    code: [
      {label: 'JS', lines: [
        ...span(travelSource, 'const hiding = ', 'const hiding = ')
      ]},
      {label: 'HTML', lines: [
        plain('<DraggableHeader hidden={hiding && aloft === key} ... />'),
        plain('<DraggableRow hiddenColumn={hiding ? aloft : undefined} ... />')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.sortable .hide,'),
        aside('/* the box stops painting; its layout space stays */')
      ]}
    ]
  }
  : {
    title: 'Leave the origin in place while it is aloft',
    dial: 'origin',
    want: 'A vanished origin can disorient; sometimes the eye wants the column both at rest and in hand while it decides.',
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
    dial: 'motion',
    want: 'A swap that teleports is honest but hard to follow — the eye loses which column went where — yet animating the layout itself makes the whole table bounce, because layout is load-bearing.',
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
      'every motion is a keyframe starting from where things used to be.',
      'Motion is a hiring decision, not a flag: the animated component casts the staged ' +
      'theater, and the core simply announces every reorder to whoever was cast. The verbs ' +
      'below are the whole cast list.'
    ],
    code: [
      {label: 'JS', lines: [
        ...unit(stagedShell, 'export const AnimatedDragSortableTable'), gap,
        ...unit(tableSource, 'const settleColumn = '), gap,
        ...unit(theaterSource, 'export const staged'),
        aside('// a direction and a share per displaced key — javascript is done')
      ]},
      {label: 'HTML', lines: [
        plain("<th className={displaced && `displaced-${toward}`} ... >"),
        plain("<tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}>"),
        aside('{/* the reorder moves the node; the class rides along */}')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.table-stage {'), gap,
        ...unit(tableCss, '.sortable .displaced-left {'), gap,
        ...unit(tableCss, '.sortable .shifted {'), gap,
        ...unit(tableCss, '@keyframes displaced-left'),
        aside('/* the share, plus the padding and border it carried */'), gap,
        ...unit(tableCss, '@keyframes shifted'),
        aside('/* .displaced-right mirrors with a negative offset */')
      ]}
    ]
  }
  : {
    title: 'Apply the state update directly',
    dial: 'motion',
    want: 'Motion is not free: it competes with the pointer, costs a frame budget, and some users ask for none at all.',
    says: ['The static table is the null theater. The same announcements land — ' +
      'columnsDisplaced, partiesSwapped, rowsShifted — and every verb has an empty body, so ' +
      'React paints the new order in the next frame and nothing is ever marked. No branches ' +
      'anywhere: choosing the component was the whole decision. There is real value in this ' +
      'mode beyond taste — nothing competes with the pointer, and no motion for ' +
      'prefers-reduced-motion users to endure.'],
    code: [
      {label: 'JS', lines: [
        ...unit(stillShell, 'export const DragSortableTable'), gap,
        ...unit(theaterSource, 'export const still'),
        aside('// the same calls land; nothing marks')
      ]}
    ]
  };

const steps = (pace: 'eager' | 'lazy', origin: 'keep' | 'hide', animated: boolean): Step[] => [
  {
    title: 'Let CSS carry its share',
    want: 'A drag built in JavaScript alone ends up reimplementing what the platform already does — cursors, keyboard, focus, selection — and doing each of them worse.',
    says: [
      'The markup stays honest HTML — a real table with real headers — so the semantics come ' +
      'free: the row grip is a button that reorders rows from the arrow keys without a line of ' +
      'drag code, and the resize handle is a separator that announces its value.',
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
        ...unit(tableCss, '.grabbable {'), gap,
        ...unit(tableCss, '.sortable {')
      ]},
      {label: 'JS', lines: [
        aside('// one measurement, slot arithmetic, and the order — nothing else')
      ]}
    ]
  },
  {
    title: 'Keep the order in state, not in the data',
    want: 'The stream keeps producing rows in its own order, and if reordering meant rewriting the data, every trade that lands would fight every drag.',
    says: ['Rows and columns arrive in whatever order the fold produced. Hold a separate list of ' +
      'keys and seats, and render the markup through it, so a reorder never touches the data — ' +
      'the same key finds its new seat and React moves the real nodes.'],
    code: [
      {label: 'JS', lines: [
        ...unit(tableSource, 'const [order, setOrder]'), gap,
        ...unit(tableSource, 'const [seats, setSeats]')
      ]},
      {label: 'HTML', lines: [
        plain('<tr>{order.map(key =>'),
        plain('    <DraggableHeader key={key} column={byKey.get(key)} ... />)}</tr>')
      ]}
    ]
  },
  {
    title: 'Lift on pointer down, and measure the table once',
    want: 'A drag needs to know where everything is, but asking the DOM on every move forces layout again and again — and mid-reorder, the DOM is the wrong authority anyway.',
    says: ['The hand is CSS before anything happens — grab on hover, grabbing on press — and ' +
      'touch-action: none is why the pointer can drag on touch at all. On pointerdown, ' +
      'JavaScript records which key is aloft and measures the table’s bounding rect a single ' +
      'time — the chart. Everything that follows is math against the chart; measuring per move ' +
      'would fight the reorder you are about to apply.'],
    code: [
      {label: 'JS', lines: [
        ...unit(tableSource, 'const liftColumn = '), gap,
        ...unit(travelSource, 'const lift = ')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.grabbable {')
      ]}
    ]
  },
  {
    title: 'Give the drag a surface of its own',
    want: 'A drag outruns the element it started on: the pointer leaves the header, handlers close over stale state, and the release can happen anywhere, even outside the window.',
    says: ['While something is aloft, the markup grows a fixed, full-viewport element carrying ' +
      'the move and drop handlers. Because React re-renders it on every settle, the handlers are ' +
      'always fresh — no stale closures, no document listeners. CSS gives it the grabbing cursor ' +
      'and, by mere existence, it blocks hover styles beneath it — no state, no class-toggling. ' +
      'Hold pointer capture on it, and treat losing the capture as the drop: releases can vanish ' +
      'into odd corners of the platform, and the capture going away is the one signal that ' +
      'always arrives.'],
    code: [
      {label: 'HTML', lines: [
        ...span(tableSource, '(has(columnsTravel.aloft) || has(rowsTravel.aloft))', '{...surface}')
      ]},
      {label: 'JS', lines: [
        ...span(travelSource, 'onPointerMove: travel', 'onLostPointerCapture: drop'), gap,
        ...unit(travelSource, 'const drop = '),
        aside('// cancel and lost capture are not delegates — they ARE the drop')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.drag-surface {'),
        aside('/* hover below is blocked by existence */')
      ]}
    ]
  },
  {
    title: 'Draw the ghost by hand',
    want: 'You need to see what you are carrying, but cloning DOM nodes is brittle, and measuring the ghost on every move is what makes drags stutter.',
    says: ['The column in your hand is not a clone of DOM nodes — it is a second table rendered ' +
      'from the same data, fixed at the lift point, its transform rendered from a drift held in ' +
      'state. Each pointer move sets the drift and React paints the translation; CSS keeps the ' +
      'ghost out of hit-testing with pointer-events: none and promises the browser motion with ' +
      'will-change. Nothing is measured per move, which is what keeps slower engines smooth.'],
    code: [
      {label: 'HTML', lines: [
        ...span(ghostSource, 'export const Ghost', '</table>;'),
        aside('{/* the same cells, rendered again from the data */}')
      ]},
      {label: 'JS', lines: [
        ...span(travelSource, 'setDrift({x: event.clientX - origin.x',
          'setDrift({x: event.clientX - origin.x')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.column-ghost {')
      ]}
    ]
  },
  {
    title: 'Find the neighbour under the pointer, with a dead zone',
    want: 'Hit-test naively and the order chatters: at a boundary, every pixel of movement flips the swap back and forth.',
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
        ...unit(chartSource, 'const deadZone = '), gap,
        ...unit(chartSource, 'export const columnUnder')
      ]}
    ]
  },
  held(pace),
  shown(origin),
  moved(animated)
];

const nudgedBoth = (animated: boolean): Step => animated
  ? {
    title: 'Both parties slide, each by the other’s share',
    dial: 'motion',
    want: 'A pointer swap has a ghost in hand to explain itself; a keyboard swap has no hand, and if only the neighbour slid, the walked column would simply teleport.',
    says: ['Mark both columns displaced. The swap still commits instantly — the same theater ' +
      'the pointer track built — but now each party is drawn starting from the seat it just ' +
      'left, offset by the other’s share, sliding home on the same keyframes. The classes ' +
      'arrive as the reorder moves the nodes, so both slides start fresh without a line of new CSS.'],
    code: [
      {label: 'JS', lines: [
        ...unit(tableSource, 'const nudgedColumn = '), gap,
        ...unit(theaterSource, 'partiesSwapped:'),
        aside('// each starts where the other now sits')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.sortable .displaced-left {'), gap,
        ...unit(tableCss, '.sortable .displaced-right {'),
        aside('/* the pointer track’s keyframes, unchanged */')
      ]}
    ]
  }
  : {
    title: 'Cut on the keypress',
    dial: 'motion',
    want: 'Motion is not free, a held key multiplies it, and some users ask for none at all.',
    says: ['Apply the order and mark nothing; the swap paints on the next frame. With no ' +
      'animation running there is nothing to pace, so a held arrow walks the column exactly as ' +
      'fast as the key repeats.'],
    code: [
      {label: 'JS', lines: [
        ...unit(theaterSource, 'export const still'),
        aside('// the walk still commits; the null theater swallows the mark')
      ]}
    ]
  };

const keyedSteps = (animated: boolean): Step[] => [
  {
    title: 'Give focus a place to land',
    want: 'A drag answers only the hand, and though the keyboard can reach the page, a plain header holds no focus — there is nothing to press.',
    says: ['HTML nearly solves this alone: the row grip is a button, focusable by birth, and ' +
      'the headers ask for focus with a tabIndex, so Tab walks every movable piece of the table ' +
      'in order. CSS answers the arrival with a focus-visible ring that draws for the keyboard ' +
      'only — pointer users never see it.'],
    code: [
      {label: 'HTML', lines: [
        ...span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
        ...span(gripSource, '<button', '</button>'),
        aside('{/* the button was focusable all along; the header asks */}')
      ]},
      {label: 'CSS', lines: [
        ...unit(tableCss, '.sortable .slot {')
      ]}
    ]
  },
  {
    title: 'Arrows speak direction',
    want: 'Focus can reach a column, but the platform ships no verb for “swap left” — the keyboard needs one.',
    says: ['A keydown handler claims the two arrows and nothing else, so every other key falls ' +
      'through untouched and tabbing and the sort menu keep working; preventDefault stops the ' +
      'page from scrolling on the keys it does claim. The walk clamps inside the anchored ' +
      'edges — the first and last columns hold the table, so the nudge stops beside them — and ' +
      'rows do the same dance turned vertical, the grip listening for up and down.'],
    code: [
      {label: 'JS', lines: [
        ...unit(headerSource, 'onKeyDown={travels'), gap,
        ...span(tableSource, 'const to = Math.min(Math.max(from + toward', '}'),
        aside('// the anchors hold; the walk stops beside them')
      ]}
    ]
  },
  nudgedBoth(animated),
  ...animated
    ? [{
      title: 'Let the slide pace the key',
      want: 'A held arrow autorepeats faster than the slide runs — nudges land mid-flight and the column outruns its own theater.',
      says: ['There are no timers in this step: before nudging, ask the element whether an ' +
        'animation is still running — getAnimations is the platform’s own record of the slide. While one runs, ' +
        'the key falls silent; the moment it ends, the next repeat lands. The animation is the ' +
        'debounce clock, and CSS already set its length.'],
      code: [
        {label: 'JS', lines: [
          ...span(headerSource, 'if ((event.currentTarget.getAnimations', '}'),
          aside('// while the slide runs, the key falls silent')
        ]},
        {label: 'CSS', lines: [
          ...unit(tableCss, '.sortable .displaced-left {'),
          aside('/* the 200ms IS the debounce interval */')
        ]}
      ]
    } satisfies Step]
    : []
];

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
        Everything below is built without a drag-and-drop library and told one hand at a time —
        take the pointer’s track or the keyboard’s. Wherever a step depends on a dial under the
        table, that dial sits on the step, and the writing follows it.
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
    <p className="lead">
      You want a live table whose columns and rows can be dragged into any order — eagerly or on
      the drop, origin shown or hidden, sliding or cutting — while the data keeps streaming
      underneath, and having that means owning every pixel of the interaction.
    </p>
    <p className="lead">
      There are two roads to dragging something across a page, and this site walks both. The{' '}
      <Link className="signpost" to={`${Paths.demos}?tab=${DemoTopics.dragAndDrop}`}>Drag sort
      list demo</Link> takes the native API — draggable, dragstart, dragover, drop — where the platform
      brings the drag image, the drop rules, and most of the behavior for very little code. That
      generosity has edges: the drag image cannot be made opaque on macOS, the cursor belongs to
      the platform, the drag image is a snapshot that cannot be animated, and on macOS even the
      cancel is the platform’s animation to run.
    </p>
    <p className="lead">
      This table takes the other road: pointer events. You could build the whole effect in
      JavaScript — track positions, set styles, move nodes by hand. This page deliberately does
      not. The markup stays a normal table; the visible changes — the cursors, the hiding, every
      slide — are CSS rules that classes switch on; and the JavaScript’s only job is deciding
      what the state is. React is the convenience in the middle: it renders the markup from that
      state, and when the order changes it moves the same keyed nodes instead of rebuilding them.
      But it affords nothing the DOM does not give you — the node moves are insertBefore, the
      handlers are events, the state is a value. It boils down to HTML, CSS, and JavaScript, and
      each code block below is labeled with which of the three is doing the work.
    </p>
    <p className="lead">
      One more thing before the steps: Eager, Lazy, Keep, Hide, Animate, and Static are this
      page’s names for the choices, not platform keywords. The dials above choose a component
      and compose its dragStyle prop — the readout under them shows exactly what they build —
      and they pick which version of the marked steps you are reading now.
    </p>
    </> : <>
    <p className="lead">
      You want every reorder the hand can make, made from the keyboard — a column walked left or
      right, a row up or down, the same slides explaining the same swaps — and it turns out to
      need almost nothing new: the state, the clamps, and the theater all exist, so this track is
      about letting focus reach them and letting two keys speak.
    </p>
    <p className="lead">
      Two of the dials go quiet here: pace and origin describe a drag session — what happens
      while something is held aloft — and a keyboard nudge holds nothing aloft. Only motion
      still chooses, and the marked step below is written the way that dial sits.
    </p>
    </>}
    <StepList steps={(track === 'pointer'
      ? steps(pace, origin, motion === 'animated')
      : keyedSteps(motion === 'animated'))
      .map(({dial, ...step}) => ({...step, dial: dial && dials[dial]}))}/>
  </section>;
};
