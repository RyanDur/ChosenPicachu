import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {
  Track,
  accessTrack,
  againstTheStream,
  aloftSource,
  cssShare,
  deadZone,
  gap,
  ghostCss,
  ghostSource,
  gripSource,
  headerCss,
  ownedPixels,
  quietDials,
  sortableCss,
  surveySource,
  turnedVertical,
  twoRoads
} from './shared-steps';
import tableSource from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyHideStaticTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/LazyHideStaticTable/useColumnTravel.ts?raw';
import cssSource from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';

export const LazyHideStaticRecipe: FC<{track: Track}> = ({track}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels}
      <Tell>This particular table keeps three more promises.
        The table holds calm and the sort lands on the drop, so only the destination matters.
        A gap opens where the column left, so the landing is never a guess.
        And the swap lands instantly, with no motion, so nothing competes with the pointer.</Tell>
      <Steps>
        {cssShare}
        <Step title="Keep the order in state, not in the data">
          <Words want="Every story runs against the stream: a reorder that rewrote the data would lose to the next trade, so order and data must never fight.">
            <Says>Rows and columns arrive in whatever order the fold produced. Hold the ordered
              columns and the seats as state, and render the markup through them, so a reorder never
              touches the data: the same key finds its new seat and React moves the real nodes.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" lines={[
              ...unit(tableSource, 'const [ordered, setOrdered]'), gap,
              ...unit(tableSource, 'const [seats, setSeats]')
            ]}/>
            <Snippet label="HTML" lines={[
              plain('<tr>{order.map(key =>'),
              plain('    <DraggableHeader key={key} column={byKey.get(key)} ... />)}</tr>')
            ]}/>
          </Codes>
        </Step>
        <Step title="Lift on pointer down, and measure the table once">
          <Words want="A carry must know the ground it stands on without asking the DOM again on every twitch of the hand.">
            <Says>The hand is CSS before anything happens, grab on hover, grabbing on press, and
              touch-action: none is why the pointer can drag on touch at all. On pointerdown,
              JavaScript records which key is aloft and measures the
              table’s <Mdn path="Web/API/Element/getBoundingClientRect">bounding rect</Mdn>, and every
              header in it, a single time: the survey. Everything that follows is math against the survey; measuring per move
              would fight the reorder you are about to apply.</Says>
            <Says>Three words you will see in every block from here. Aloft is whatever you are
              carrying, named by its key. The survey is a plain record of that one measurement: the
              table’s box, each column’s width, and later the row heights. And has is this site’s null check, from a small
              library called <a className="signpost"
                href="https://ryandur.github.io/sand/"
                target="_blank"
                rel="noreferrer">sand</a>; it answers false for nothing and for empty.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" lines={[
              ...unit(hookSource, 'const lift = '), gap,
              ...span(tableSource, 'onLift={columnsTravel.lift}', 'onLift={columnsTravel.lift}')
            ]}/>
            <Snippet label="CSS" lines={[
              ...unit(sortableCss, '.grabbable {')
            ]}/>
          </Codes>
        </Step>
        <Step title="Give the drag a surface of its own">
          <Words want="The carry outruns the header it grabbed: the pointer leaves the element mid-drag, and the release can land anywhere, even outside the window.">
            <Says>Your first surface is the document: add two listeners at lift, remove them at drop.
              Now travel is running against the order as it stood when the drag began, and every path
              out of the drag owes you a cleanup.</Says>
            <Says>While something is aloft, the markup grows a fixed, full-viewport element carrying
              the move and drop handlers. Because React re-renders it on every settle, the handlers are
              always fresh: no stale closures, no document listeners. CSS gives it the grabbing cursor
              and, by mere existence, it blocks hover styles beneath it, with no state and no
              class-toggling. Hold <Mdn path="Web/API/Element/setPointerCapture">pointer capture</Mdn> on
              it, and treat <Mdn path="Web/API/Element/lostpointercapture_event">losing the capture</Mdn> as
              the drop: releases can vanish into odd corners of the platform, and the capture going
              away is the one signal that always arrives.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" foil lines={[
              plain("document.addEventListener('pointermove', travel);"),
              plain("document.addEventListener('pointerup', drop);"), gap,
              aside('// travel closed over the order at lift time, and every'),
              aside('// path out of the drag owes a removeEventListener')
            ]}/>
            <Snippet label="HTML" lines={[
              ...span(aloftSource, '(has(columnsTravel.aloft) || has(rowsTravel.aloft))', '{...surface}')
            ]}/>
            <Snippet label="JS" lines={[
              ...span(hookSource, 'onPointerMove: travel', 'onLostPointerCapture: drop'), gap,
              ...unit(hookSource, 'const drop = '),
              aside('// cancel and lost capture are not delegates; they ARE the drop')
            ]}/>
            <Snippet label="CSS" lines={[
              ...unit(sortableCss, '.drag-surface {'),
              aside('/* hover below is blocked by existence */')
            ]}/>
          </Codes>
        </Step>
        <Step title="Draw the ghost by hand">
          <Words want="The carried column has to be visible in the hand, smoothly, on slow machines too.">
            <Says>The column in your hand is not a clone of DOM nodes. It is a second table rendered
              from the same data. The flight is where you grabbed it; the drift is how far you have
              moved since; both are state, and the ghost renders at the flight, translated by the
              drift. Each pointer move sets the drift and React paints the translation; CSS keeps the
              ghost out of hit-testing with <Mdn path="Web/CSS/pointer-events">pointer-events</Mdn>: none
              and promises the browser motion with <Mdn path="Web/CSS/will-change">will-change</Mdn>.
              Nothing is measured per move, which is what keeps slower engines smooth.</Says>
          </Words>
          <Codes>
            <Snippet label="HTML" lines={[
              ...span(ghostSource, 'export const Ghost', '</table>;'),
              aside('{/* the same cells, rendered again from the data */}')
            ]}/>
            <Snippet label="JS" lines={[
              ...span(hookSource, 'setDrift({x: event.clientX - origin.x',
                'setDrift({x: event.clientX - origin.x')
            ]}/>
            <Snippet label="CSS" lines={[
              ...unit(ghostCss, '.column-ghost {')
            ]}/>
          </Codes>
        </Step>
        {deadZone}
        <Step title="Stash the landing, commit on release" dial={<PaceDial name="step-pace"/>}>
          <Words want="The trader wants the table calm while they drag, because mid-flight churn distracts and only the destination matters.">
            <Says>With lazy pace, remember the last neighbour struck and do nothing else. The table
              holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot
              clears the landing, so a drop at home changes nothing.</Says>
            <Says>The lazy hook is its own handler, not a flag on the eager one: a strike is only ever
              remembered as the landing, and drop, which also answers cancel and a lost capture,
              commits it.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" lines={[
              ...unit(hookSource, 'const travel = '), gap,
              ...unit(hookSource, 'const drop = ')
            ]}/>
          </Codes>
        </Step>
        <Step title="Blank the origin while it is aloft" dial={<OriginDial name="step-origin"/>}>
          <Words want="With the ghost in hand, the trader reads the origin column as a duplicate, and nothing says where the drop will land.">
            <Says>We could unmount the origin while it travels, but its space would collapse and
              the whole table would shift; so the disappearance takes a component choice and one word
              of CSS instead. This is the hide table, so there is no flag anywhere: the markup compares the aloft key against each
              cell, and CSS does the
              vanishing: <Mdn path="Web/CSS/visibility">visibility</Mdn> hidden takes the whole column
              (text, borders, grip, everything) while its layout space remains as the gap where the
              drop will land. Nothing unmounts.</Says>
          </Words>
          <Codes>
            <Snippet label="HTML" lines={[
              ...span(tableSource, 'aloft={columnsTravel.aloft}', 'aloft={columnsTravel.aloft}'), gap,
              ...span(tableSource, 'aloft={rowsTravel.aloft}', 'aloftColumn={columnsTravel.aloft}')
            ]}/>
            <Snippet label="JS" lines={[
              ...span(headerSource, 'const hidden = aloft === columnName;', 'const hidden = aloft === columnName;'),
              aside('// being the hide table is the flag; the element serves itself')
            ]}/>
            <Snippet label="CSS" lines={[
              ...unit(cssSource, '.sortable .hide,'),
              aside('/* the box stops painting; its layout space stays */')
            ]}/>
          </Codes>
        </Step>
        <Step title="Apply the state update directly" dial={<MotionDial name="step-motion"/>}>
          <Words want="Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.">
            <Says>The static table is not the animated one with a switch off; it is a different
              table with no marking code in it. Its settle is the whole story: move the key, let
              React paint, and there is nothing else, because nothing else exists in this file.
              There is real value in this mode beyond taste: nothing competes with the pointer, and
              no motion for prefers-reduced-motion users to endure.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" lines={[
              ...unit(tableSource, 'const settleColumn = '),
              aside('// the whole settle; no marking code exists in this table')
            ]}/>
          </Codes>
        </Step>
      </Steps>
    </Story>
    <Story param="sort" id="row"
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      {turnedVertical}
      <Steps>
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
            <Snippet label="HTML" lines={[
              ...span(gripSource, '<button', '</button>'),
              aside('{/* focusable by birth; the keyboard track will thank us */}')
            ]}/>
            <Snippet label="JS" lines={[
              ...unit(surveySource, 'export const rowUnder'), gap,
              ...unit(tableSource, 'const settleRow = ')
            ]}/>
          </Codes>
        </Step>
      </Steps>
    </Story>
  </>
  : <Story param="sort" id="keyboard"
           can="The trader can sort without a mouse"
           soThat="the table answers whoever arrives at it">
    {accessTrack}
    {quietDials}
    <Steps>
      <Step title="Give focus a place to land">
        <Words want="The trader without a pointer expects the same reorders, and first, focus needs a place to land; a plain header holds none.">
          <Says>HTML nearly solves this alone: the row grip is a button, focusable by birth, and
            the headers ask for focus with
            a <Mdn path="Web/HTML/Global_attributes/tabindex">tabIndex</Mdn>, so Tab walks every
            movable piece of the table in order. CSS answers the arrival with
            a <Mdn path="Web/CSS/:focus-visible">focus-visible</Mdn> ring that draws for the keyboard
            only; pointer users never see it.</Says>
        </Words>
        <Codes>
          <Snippet label="HTML" lines={[
            ...span(headerSource, 'tabIndex={travels', 'tabIndex={travels'), gap,
            ...span(gripSource, '<button', '</button>'),
            aside('{/* the button was focusable all along; the header asks */}')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(headerCss, '.sortable .header-cell {')
          ]}/>
        </Codes>
      </Step>
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
          <Snippet label="JS" lines={[
            ...unit(headerSource, 'onKeyDown={travels'),
            aside('// the anchors hold; the walk stops beside them')
          ]}/>
        </Codes>
      </Step>
      <Step title="Cut on the keypress" dial={<MotionDial name="step-motion"/>}>
        <Words want="Motion is not free, a held key multiplies it, and some traders ask for none at all.">
          <Says>Apply the order and mark nothing; the swap paints on the next frame. With no
            animation running there is nothing to pace, so a held arrow walks the column exactly as
            fast as the key repeats.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...span(headerSource, 'const from = order.indexOf(columnName);', 'onOrdered(columnName, to);'),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
