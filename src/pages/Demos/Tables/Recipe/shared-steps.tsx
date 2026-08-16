import {ReactNode} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Codes, Mdn, Says, Snippet, Step, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {SlotsFigure} from './SlotsFigure';
import {World} from '../params';
import aloftSource from '@components/DragSortableTable/Aloft.tsx?raw';
import surveySource from '@components/DragSortableTable/survey.ts?raw';
import gripSource from '@components/DragSortableTable/RowGrip.tsx?raw';
import ghostSource from '@components/DragSortableTable/ghosts/Ghost.tsx?raw';
import sortableCss from '@components/DragSortableTable/sortable.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import ghostCss from '@components/DragSortableTable/ghosts/Ghost.css?raw';
import frameHtml from '../Frame/table.html?raw';
import frameShell from '../Frame/shell.ts?raw';

export {aloftSource, surveySource, gripSource, ghostSource, sortableCss, headerCss, ghostCss, frameShell};

export type {Track, World} from '../params';
export {trackParam} from '../params';

export const gap = plain(' ');

export const twoRoads =
  <Tell>There are two roads to dragging something across a page, and this site walks
    both. The <Link className="signpost"
    to={`${Paths.demos}?tab=${DemoTopics.dragAndDrop}`}>Drag sort list demo</Link> takes
    the native API, where the platform brings most of the behavior for very little code;
    its edges (the snapshot that cannot be animated, the cursor that belongs to the
    platform, the macOS cancel) are that road’s own story. This table takes the other
    road: <Mdn path="Web/API/Pointer_events">pointer events</Mdn>, where every pixel is
    ours to own and no drag-and-drop library is anywhere in the build.</Tell>;

export const againstTheStream =
  <Tell>The trader needs to move a column while the stream writes. We could reorder
    the data itself, but every trade that lands would fight every drag; so the order is
    its own piece of state, and the markup renders through it. Moving a column is just
    changing the order. We could ask the DOM where everything is as the pointer moves,
    but layout queries during a drag cause the jank we are trying to avoid; so
    everything the drag needs gets measured once, when you grab.</Tell>;

export const ownedPixels = (world: World): ReactNode =>
  <Tell>And owning the pixels does not mean building in JavaScript. The markup stays a
    normal table; every visible change (the cursors, the hiding, every slide) is a CSS
    rule a class switches on; JavaScript only decides what the state is,
    and {world === 'react'
      ? 'React affords nothing the DOM does not give you'
      : 'no framework stands anywhere in the frame'}: the node moves
    are <Mdn path="Web/API/Node/insertBefore">insertBefore</Mdn>, the handlers are
    events, the state is a value. Each code block below is labeled with which of the
    three languages is doing the work.</Tell>;

export const turnedVertical =
  <Tell>We could build rows their own machinery, but the need is the same motion
    turned vertical; so rows ride what the columns built. The differences that remain
    are honest ones: a grip button to grab, row heights in the survey, and a vertical
    hit test. The promises the dials set ride along unchanged; the turn changes the
    axis, nothing else.</Tell>;

export const accessTrack =
  <Tell>We could build the keyboard its own sorting system, but the state, the clamps,
    and the slides already exist; so this track is about access. Focus reaches every grip
    and every header, and two arrow keys get everything the hand has.</Tell>;

export const quietDials =
  <Tell>Two of the dials go quiet here: pace and origin describe a drag session, what happens
    while something is held aloft, and a keyboard nudge holds nothing aloft. Only motion
    still chooses, and the marked step below is written the way that dial sits.</Tell>;

const shareMarkup: Record<World, ReactNode> = {
  react: <Snippet label="HTML" lines={[
    plain('<table><thead><tr><th scope="col">window</th> ...'),
    plain('<button className="grip" aria-label="move row 2"><Handle/></button>'),
    plain('<button className="resize-handle" aria-label="resize trades, 24%"/>')
  ]}/>,
  html: <Snippet label="HTML" lines={[
    plain('<th scope="col" class="cell window header-cell clipped">'),
    plain('<button type="button" class="grip grabbable" aria-label="move row 2">'),
    plain('<button type="button" class="resize-handle" aria-label="resize trades">')
  ]}/>
};

export const cssShare = (world: World): ReactNode =>
  <Step title="Let CSS carry its share">
    <Words want="Whatever the trader arrives with (mouse, touchscreen, keyboard), the platform’s manners come first: cursors that offer the hand, touch that drags, selections that never smear mid-drag.">
      <Says>The markup stays honest HTML, a real table with real headers, so the semantics come
        free: the row grip is a button that reorders rows from the arrow keys without a line of
        drag code, and the resize handle is
        a real <Mdn path="Web/HTML/Element/button">button</Mdn> that announces itself by
        name, and its share once the ledger exists.</Says>
      <Says>CSS carries more of the effect than it appears: the open hand and the closed fist
        are <Mdn path="Web/CSS/cursor">cursors</Mdn>, <Mdn path="Web/CSS/touch-action">touch-action</Mdn>:
        none is the single line that lets pointer events drag on a touchscreen,
        and <Mdn path="Web/CSS/user-select">user-select</Mdn>: none keeps a fast drag from sweeping
        text selections. JavaScript is left holding only what neither can: one measurement, some
        arithmetic, and the order.</Says>
    </Words>
    <Codes>
      {shareMarkup[world]}
      <Snippet label="CSS" lines={[
        ...unit(sortableCss, '.grabbable {'), gap,
        ...unit(sortableCss, '.sortable {')
      ]}/>
      <Snippet label="TS" lines={[
        aside('// one measurement, slot arithmetic, and the order; nothing else')
      ]}/>
    </Codes>
  </Step>;

export const deadZone =
  <Step title="Find the neighbour under the pointer, with a dead zone">
    <Words want="A drift along a boundary must not chatter the order under the hand.">
      <Says>This step is JavaScript alone, on purpose: where the pointer is, in table terms,
        is a walk over cumulative column widths: arithmetic on the survey,
        never <Mdn path="Web/API/Document/elementFromPoint">elementFromPoint</Mdn>. A{' '}
        neighbour only yields once the pointer reaches its inner half: the outer quarter is a
        dead zone, without which the reorder oscillates when a wide column passes a narrow one.
        After a swap the pointer sits over the carried column itself, a no-op, so reversing
        means deliberately reaching the neighbour’s inner half again. Hysteresis, for free,
        from geometry. The ruling itself is struckPast, one function with no axis in it; the
        vertical turn will reuse it unchanged.</Says>
      <SlotsFigure/>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(surveySource, 'const deadZone = '), gap,
        ...unit(surveySource, 'const struckPast = '), gap,
        ...unit(surveySource, 'export const columnUnder')
      ]}/>
    </Codes>
  </Step>;

export const orderInState = (world: World, tableSource: string): ReactNode =>
  <Step title="Keep the order in state, not in the data">
    <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
      {world === 'react'
        ? <Says>Rows and columns arrive in whatever order the fold produced. Hold the ordered
          columns and the seats as state, and render the markup through them, so a reorder never
          touches the data: the same key finds its new seat and React moves the real nodes.</Says>
        : <Says>Rows and columns arrive dealt by the markup, and the markup is the source of the
          structural knowledge: the shell reads the order off the header classes and seats every
          lane by its birth index. Both live on the desk, and paint renders through them, so a
          reorder never touches the data: the same lane finds its new seat, and insertBefore moves
          the real node only when its seat actually changed.</Says>}
    </Words>
    {world === 'react'
      ? <Codes>
        <Snippet label="TS" lines={[
          ...unit(tableSource, 'const [ordered, setOrdered]'), gap,
          ...unit(tableSource, 'const [seats, setSeats]')
        ]}/>
        <Snippet label="HTML" lines={[
          plain('<tr>{order.map(key =>'),
          plain('    <DraggableHeader key={key} column={byKey.get(key)} ... />)}</tr>')
        ]}/>
      </Codes>
      : <Codes>
        <Snippet label="TS" lines={[
          ...unit(frameShell, 'export type Desk'), gap,
          ...span(frameShell, "const order = [...table.querySelectorAll('thead th')]",
            'const desk: Desk = {order, seats: dealt, seated: dealt, shares: undefined};')
        ]}/>
        <Snippet label="TS" lines={[
          ...span(frameShell, 'desk.seated.forEach((at, position) => {',
            'body.insertBefore(desired, body.children[position] ?? null);'),
          aside('// the same lane, its new seat: the shell moves the node, not a copy')
        ]}/>
      </Codes>}
  </Step>;

export const liftOnce = (world: World, hookSource: string, tableSource: string, shellSrc: string): ReactNode =>
  <Step title="Lift on pointer down, and measure the table once">
    <Words want="A carry must know the ground it stands on without asking the DOM again on every twitch of the hand.">
      {world === 'react'
        ? <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          JavaScript records which key is aloft and measures the
          table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn>, and every
          header in it, a single time: the survey. Everything that follows is math against the survey; measuring per move
          would fight the reorder you are about to apply.</Says>
        : <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
          touch-action: none is why the pointer can drag on touch at all. On pointerdown,
          the shell measures the
          table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn>, and every
          header in it, a single time: the survey. Then it summons the ghost and takes flight.
          Everything that follows is math against the survey; measuring per move
          would fight the reorder you are about to apply.</Says>}
      {world === 'react'
        ? <Says>A few words you will see in every block from here. Aloft is whatever you are
          carrying, named by its key. It rides in a Maybe from a small library
          called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>: nothing until a lift, and map runs only while something is
          held. The survey is a plain record of that one measurement: the table’s box, each
          column’s width, and later the row heights. And has is the same library’s null check;
          it answers false for nothing and for empty.</Says>
        : <Says>A few words you will see in every block from here. Held is whatever you are
          carrying, named by its column or its seat, and it lives in the listener’s own closure:
          no state store anywhere. The survey is a plain record of that one measurement: the
          table’s box, each column’s width, and later the row heights. And has is the null check
          from a small library
          called <a className="signpost"
            href="https://ryandur.github.io/sand/"
            target="_blank"
            rel="noreferrer">sand</a>; it answers false for nothing and for empty.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(hookSource, 'const lift = '), gap,
          ...span(tableSource, 'onLift={columnsTravel.lift}', 'onLift={columnsTravel.lift}')
        ]}/>
        : <Snippet label="TS" lines={[
          ...span(shellSrc, "th.addEventListener('pointerdown'",
            'const from = {x: event.clientX, y: event.clientY};')
        ]}/>}
      <Snippet label="CSS" lines={[
        ...unit(sortableCss, '.grabbable {')
      ]}/>
    </Codes>
  </Step>;

export const dragSurface = (world: World, hookSource: string): ReactNode =>
  <Step title="Give the drag a surface of its own">
    <Words want="The carry outruns the header it grabbed: the pointer leaves the element mid-drag, and the release can land anywhere, even outside the window.">
      <Says>Your first surface is the document: add two listeners at lift, remove them at drop.
        Now travel is running against the order as it stood when the drag began, and every path
        out of the drag owes you a cleanup.</Says>
      {world === 'react'
        ? <Says>While something is aloft, the markup grows a fixed, full-viewport element carrying
          the move and drop handlers. Because React re-renders it on every settle, the handlers are
          always fresh: no stale closures, no document listeners. CSS gives it the grabbing cursor
          and, by mere existence, it blocks hover styles beneath it, with no state and no
          class-toggling. Hold <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on
          it, and treat <Mdn path="Web/API/Element/lostpointercapture_event">losing the capture</Mdn> as
          the drop: releases can vanish into odd corners of the platform, and the capture going
          away is the one signal that always arrives.</Says>
        : <Says>While something is aloft, the shell appends a fixed, full-viewport element carrying
          the move and drop handlers, and removes it at the landing: the surface exists exactly as
          long as the drag does, so nothing can go stale. CSS gives it the grabbing cursor
          and, by mere existence, it blocks hover styles beneath it, with no state and no
          class-toggling. Hold <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on
          it, and treat <Mdn path="Web/API/Element/lostpointercapture_event">losing the capture</Mdn>,
          or a move with no buttons pressed, as the drop: releases can vanish into odd corners of
          the platform, and the capture going away is the one signal that always arrives.</Says>}
    </Words>
    <Codes>
      <Snippet label="TS" foil lines={[
        plain("document.addEventListener('pointermove', travel);"),
        plain("document.addEventListener('pointerup', drop);"), gap,
        aside('// travel closed over the order at lift time, and every'),
        aside('// path out of the drag owes a removeEventListener')
      ]}/>
      {world === 'react'
        ? <Snippet label="HTML" lines={[
          ...span(aloftSource, '(!columnsTravel.aloft.isNothing || !rowsTravel.aloft.isNothing)', '{...surface}')
        ]}/>
        : undefined}
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...span(hookSource, 'onPointerMove: travel', 'onLostPointerCapture: drop'), gap,
          ...unit(hookSource, 'const drop = '),
          aside('// cancel and lost capture are not delegates; they ARE the drop')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(frameShell, 'export const takeFlight'),
          aside('// cancel, lost capture, and buttons at zero are not delegates; they ARE the drop')
        ]}/>}
      <Snippet label="CSS" lines={[
        ...unit(sortableCss, '.drag-surface {'),
        aside('/* hover below is blocked by existence */')
      ]}/>
    </Codes>
  </Step>;

export const ghostByHand = (world: World, hookSource: string): ReactNode =>
  <Step title="Draw the ghost by hand">
    <Words want="The carried column has to be visible in the hand, smoothly, on slow machines too.">
      {world === 'react'
        ? <Says>The column in your hand is not a clone of DOM nodes. It is a second table rendered
          from the same data. The flight is where you grabbed it; the drift is how far you have
          moved since; both are state, and the ghost renders at the flight, translated by the
          drift. The first move seeds the origin; every move after sets the drift against it
          and React paints the translation; CSS keeps the
          ghost out of hit-testing with <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none
          and promises the browser motion with <Mdn path="Web/CSS/will-change">will-change</Mdn>.
          Nothing is measured per move, which is what keeps slower engines smooth.</Says>
        : <Says>The column in your hand is not a clone of live nodes. It is a second table stamped
          from a template the page already carries: the shell fills its header and its cells once,
          at the lift, from the lanes as they stand. The flight is where you grabbed it; the drift
          is how far you have moved since; both ride custom properties a transform composes, so
          every move writes two numbers and nothing is measured per move, which is what keeps
          slower engines smooth. CSS keeps the
          ghost out of hit-testing with <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none
          and promises the browser motion with <Mdn path="Web/CSS/will-change">will-change</Mdn>.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="HTML" lines={[
          ...span(ghostSource, 'export const Ghost', '</table>;'),
          aside('{/* the same cells, rendered again from the data */}')
        ]}/>
        : <Snippet label="HTML" lines={[
          ...span(frameHtml, '<template id="column-ghost">', '</template>'),
          aside('<!-- the shape is the page’s own; the shell only fills it -->')
        ]}/>}
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...span(hookSource, 'origin.either(',
            'setOrigin(maybe({x: event.clientX')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(frameShell, 'export const columnGhost'), gap,
          ...unit(frameShell, 'const flown = ')
        ]}/>}
      <Snippet label="CSS" lines={[
        ...unit(ghostCss, '.column-ghost {')
      ]}/>
    </Codes>
  </Step>;

export const theaterVertical = (world: World, tableSource: string, shellSrc: string): ReactNode =>
  <Step title="Turn the theater vertical">
    <Words want="A window is a row: the same carry on a second axis, and the hand needs something honest to hold.">
      <Says>Rows ride the machinery the columns built, with three substitutions. The grip is a
        real button, so the hand has a target and the keyboard will later get one free. The
        survey learns row heights at lift, measured once like everything else. And rowUnder
        answers which seat sits under the pointer, columnUnder turned vertical. One more word:
        the seats are the seating chart, the rows’ order; a row keeps its number as the seats
        shuffle. The settle is the same story: the moved row takes its new seat, and the rest
        ride along.</Says>
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="HTML" lines={[
          ...span(gripSource, '<button', '</button>'),
          aside('{/* focusable by birth; the keyboard track will thank us */}')
        ]}/>
        : <Snippet label="HTML" lines={[
          ...span(frameHtml, '<button type="button" class="grip grabbable" aria-label="move row 1">', '</button>'),
          aside('<!-- focusable by birth; the keyboard track will thank us -->')
        ]}/>}
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(surveySource, 'export const rowUnder'), gap,
          ...unit(tableSource, 'const settleRow = ')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(surveySource, 'export const rowUnder'), gap,
          ...unit(shellSrc, 'const commit = (struck')
        ]}/>}
    </Codes>
  </Step>;

export const focusLands = (world: World, headerSource: string): ReactNode =>
  <Step title="Give focus a place to land">
    <Words want="The trader without a pointer expects the same reorders, and first, focus needs a place to land; a plain header holds none.">
      {world === 'react'
        ? <Says>HTML nearly solves this alone: the row grip is a button, focusable by birth, and
          the headers ask for focus with
          a <Mdn path="Web/HTML/Global_attributes/tabindex">tabIndex</Mdn>, so Tab walks every
          movable piece of the table in order. CSS answers the arrival with
          a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
          only; pointer users never see it.</Says>
        : <Says>HTML nearly solves this alone: the row grip is a button in the markup, focusable by
          birth, and the shell asks each movable header for focus with
          a <Mdn path="Web/HTML/Global_attributes/tabindex">tabindex</Mdn> as it dresses the grips
          (the anchored edges hold the table, so their headers ask for nothing), so Tab walks every
          movable piece of the table in order. CSS answers the arrival with
          a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
          only; pointer users never see it.</Says>}
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="HTML" lines={[
          ...span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
          ...span(gripSource, '<button', '</button>'),
          aside('{/* the button was focusable all along; the header asks */}')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(frameShell, 'export const dressGrips'),
          aside('// the button was focusable all along; the shell asks for the headers')
        ]}/>}
      <Snippet label="CSS" lines={[
        ...unit(headerCss, '.sortable .header-cell {')
      ]}/>
    </Codes>
  </Step>;

export const arrowsSpeak = (world: World, headerSource: string, shellSrc: string): ReactNode =>
  <Step title="Arrows speak direction">
    <Words want="The trader’s focus can reach a column, but the platform ships no verb for “swap left”; they need one.">
      <Says>A <Mdn path="Web/API/Element/keydown_event">keydown</Mdn> handler claims the two
        arrows and nothing else, so every other key falls through untouched and tabbing and the
        sort menu keep
        working; <Mdn path="Web/API/Event/preventDefault">preventDefault</Mdn> stops the page
        from scrolling on the keys it does claim. The walk clamps inside the anchored
        edges: the first and last columns hold the table, so the nudge stops beside them, and
        rows do the same dance turned vertical, the grip listening for up and down.</Says>
    </Words>
    <Codes>
      {world === 'react'
        ? <Snippet label="TS" lines={[
          ...unit(headerSource, 'onKeyDown={travels'),
          aside('// the anchors hold; the walk stops beside them')
        ]}/>
        : <Snippet label="TS" lines={[
          ...unit(shellSrc, "th.addEventListener('keydown'"),
          aside('// the anchors hold; the walk stops beside them')
        ]}/>}
    </Codes>
  </Step>;
