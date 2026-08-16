import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {
  Track,
  World,
  accessTrack,
  againstTheStream,
  arrowsSpeak,
  cssShare,
  deadZone,
  dragSurface,
  focusLands,
  frameHide,
  frameMarks,
  frameStand,
  gap,
  ghostByHand,
  liftOnce,
  orderInState,
  ownedPixels,
  quietDials,
  theaterVertical,
  travelSource,
  turnedVertical,
  twoRoads
} from './shared-steps';
import shellSrc from '../Frame/shells/EagerHideAnimated.ts?raw';
import tableSource from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerHideAnimatedTable/Header.tsx?raw';
import cssSource from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.css?raw';

export const EagerHideAnimatedRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      <Tell>This particular table keeps three more promises.
        The sort happens while you drag, so a wrong grab costs nothing.
        A gap opens where the column left, so the landing is never a guess.
        And the swap slides into place, so the eye never loses a column.</Tell>
      <Steps>
        {cssShare(world)}
        {orderInState(world)}
        {liftOnce(world, tableSource)}
        {dragSurface(world, tableSource)}
        {ghostByHand(world, tableSource)}
        {deadZone}
        <Step title="Commit inside the move" dial={<PaceDial name="step-pace"/>}>
          <Words want="The trader wants the table to answer inside the move, so that they can change their mind before the drop.">
            {world === 'react'
              ? <Says>With eager pace, settle as soon as a neighbour is struck: the order state updates
                mid-drag, and because the markup renders through that order, the same key finds its new
                seat and React moves the real cells. Carrying the column back is just more crossings:
                home is always reachable. No style changes hands here at all.</Says>
              : <Says>With eager pace, commit as soon as a neighbour is struck: the commit deals a new
                order onto the desk, and the reconcile moves the real cells to match it. Carrying the
                column back is just more crossings: home is always reachable. No style changes hands
                here at all.</Says>}
            {world === 'react'
              ? <Says>This is the whole eager hook’s handler, and there is no landing state to keep anywhere
                in it: buttons at zero heals a drag whose release was swallowed, the surface claims the
                pointer capture, the drift feeds the ghost, and a strike settles on the spot.</Says>
              : <Says>This is the whole travel of the eager shell, and there is no landing state to keep
                anywhere in it: the drift feeds the ghost, columnUnder answers from the survey, and a
                strike commits on the spot; the buttons-at-zero healing lives back in takeFlight, once,
                for every shell.</Says>}
          </Words>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(tableSource, 'const settleColumn = '), gap,
                ...unit(tableSource, 'const columnTravel = ')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(shellSrc, 'const settleColumn = '), gap,
                ...unit(shellSrc, 'const columnTravel = ')
              ]}/>}
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                plain('<DraggableHeader key={key} ... />'),
                aside('{/* same key, new seat: React moves the node, not a copy */}')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(frameStand, 'const reconcileColumns = '),
                aside('// the same cells, new seats: the shell moves the node, not a copy')
              ]}/>}
            <Snippet label="TS" lines={[
              ...unit(travelSource, 'export const eagerTravel'),
              aside('// one travel ruling; each world answers with its own settle')
            ]}/>
          </Codes>
        </Step>
        <Step title="Blank the origin while it is aloft" dial={<OriginDial name="step-origin"/>}>
          <Words want="With the ghost in hand, the trader reads the origin column as a duplicate, and nothing says where the drop will land.">
            {world === 'react'
              ? <Says>We could unmount the origin while it travels, but its space would collapse and
                the whole table would shift; so the disappearance takes a component choice and one word
                of CSS instead. This is the hide table, so there is no flag anywhere: the markup compares the aloft key against each
                cell, and CSS does the
                vanishing: <Mdn path="Web/CSS/visibility">visibility</Mdn> hidden takes the whole column
                (text, borders, grip, everything) while its layout space remains as the gap where the
                drop will land. Nothing unmounts.</Says>
              : <Says>We could pull the origin out of the DOM while it travels, but its space would
                collapse and the whole table would shift; so the disappearance takes one class and one
                word of CSS instead. This is the hide shell, so there is no flag anywhere: the grab
                blanks the column it lifted and the landing unblanks it, and CSS does the
                vanishing: <Mdn path="Web/CSS/visibility">visibility</Mdn> hidden takes the whole column
                (text, borders, grip, everything) while its layout space remains as the gap where the
                drop will land. Nothing leaves the DOM.</Says>}
          </Words>
          <Codes>
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                ...span(tableSource, 'aloft={columnsTravel.aloft}', 'aloft={columnsTravel.aloft}'), gap,
                ...span(tableSource, 'aloft={rowsTravel.aloft}', 'aloftColumn={columnsTravel.aloft}')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(frameHide, 'export const hideColumn'),
                aside('// the grab calls it at the lift; the landing calls unhideColumn')
              ]}/>}
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...span(headerSource, 'const hidden = aloft.map(held => held === columnName).orElse(false);', 'const hidden = aloft.map(held => held === columnName).orElse(false);'),
                aside('// being the hide table is the flag; the element serves itself')
              ]}/>
              : undefined}
            <Snippet label="CSS" lines={[
              ...unit(cssSource, '.sortable .hide,'),
              aside('/* the box stops painting; its layout space stays */')
            ]}/>
          </Codes>
        </Step>
        <Step title="Slide the theater, not the layout" dial={<MotionDial name="step-motion"/>}>
          <Words want="The trader must be able to follow which column went where; a teleport is honest but unreadable, and animating the layout itself would bounce the whole table, because layout is load-bearing.">
            <Says>A swap commits instantly: the carried column already sits at full width in its new
              slot, hidden or under the ghost, and the layout underneath is final. The displaced column
              is merely drawn where it used to be, sliding home on
              a <Mdn path="Web/CSS/transform">transform</Mdn>. Transforms cannot move layout, so nothing
              else can shift: a bounce is impossible by construction.</Says>
            {world === 'react'
              ? <Says>The three languages split the trick cleanly. JavaScript marks who was displaced and
                hands over two lengths it already owns, both measured by the survey: the carried
                column’s width and each row’s drop. The markup carries the mark as a class that arrives
                exactly as the reorder moves the node. CSS does all the moving:
                a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from is the old position, a pixel
                length the survey measured at the lift; applying the class starts the slide fresh,
                and <Mdn path="Web/API/Element/animationend_event">animationend</Mdn> hands the class
                back.</Says>
              : <Says>The three languages split the trick cleanly. JavaScript marks who was displaced and
                hands over two lengths it already owns, both measured by the survey: the carried
                column’s width and each row’s drop. The shell writes the mark as a class the moment it
                moves the node. CSS does all the moving:
                a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from is the old position, a pixel
                length the survey measured at the lift; applying the class starts the slide fresh,
                and <Mdn path="Web/API/Element/animationend_event">animationend</Mdn> hands the class
                back.</Says>}
            <Says>Rows are the same theater turned vertical: heights measured once, in whatever event
              reorders them, become per-row pixel offsets, and every displaced row starts at
              translateY(var(--drop)) and slides home. Nothing in this table rides a view transition;
              every motion is a keyframe starting from where things used to be.</Says>
            {world === 'react'
              ? <Says>Motion is not a flag on this table; it is this table. The animated variant marks its
                own theater inline in its settles, the dial above chooses which of eight tables you are
                reading, and the readout under the dials names it.</Says>
              : <Says>Motion is not a flag on this shell; it is this shell. The animated variant marks its
                own theater inline in its commits, the dial above chooses which of eight shells you are
                reading, and the readout under the dials names it.</Says>}
          </Words>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(tableSource, 'const settleColumn = '),
                aside('// a direction and a share per displaced key; javascript is done')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(shellSrc, 'const settleColumn = '), gap,
                ...unit(frameMarks, 'const markCell = '),
                aside('// a direction and a share per displaced key; javascript is done')
              ]}/>}
            {world === 'react'
              ? <Snippet label="HTML" lines={[
                plain("<th className={displaced && `displaced-${toward}`} ... >"),
                plain("<tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}>"),
                aside('{/* the reorder moves the node; the class rides along */}')
              ]}/>
              : undefined}
            <Snippet label="CSS" lines={[
              ...unit(cssSource, '.sortable .displaced {'), gap,
              ...unit(cssSource, '.sortable .shifted {'), gap,
              ...unit(cssSource, '@keyframes displaced'),
              aside('/* --toward flips the sign; direction is data, not a name */'), gap,
              ...unit(cssSource, '@keyframes shifted')
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
        {theaterVertical(world, tableSource, shellSrc)}
      </Steps>
    </Story>
  </>
  : <Story param="sort" id="keyboard"
           can="The trader can sort without a mouse"
           soThat="the table answers whoever arrives at it">
    {accessTrack}
    {quietDials}
    <Steps>
      {focusLands(world, headerSource)}
      {arrowsSpeak(world, headerSource)}
      <Step title="Both parties slide, each by the other’s share" dial={<MotionDial name="step-motion"/>}>
        <Words want="A pointer swap explains itself with a ghost in hand; the trader’s keyboard swap has no hand, and if only the neighbour slid, the walked column would simply teleport.">
          <Says>Mark both columns displaced. The swap still commits instantly, the same theater
            the pointer track built, but now each party is drawn starting from the seat it just
            left, offset by the other’s share, sliding home on the same keyframes. The classes
            arrive as the reorder moves the nodes, so both slides start fresh without a line of new CSS.</Says>
        </Words>
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...unit(travelSource, 'export const animatedColumnArrows'), gap,
              ...unit(headerSource, 'const ordered = '), gap,
              ...span(headerSource, 'onKeyDown={travels ? animatedColumnArrows', 'onKeyDown={travels ? animatedColumnArrows'),
              aside('// each starts where the other now sits')
            ]}/>
            : <Snippet label="TS" lines={[
              ...unit(travelSource, 'export const animatedColumnArrows'), gap,
              ...unit(shellSrc, 'const ordered = '), gap,
              ...span(shellSrc, 'column: (shell, held) => animatedColumnArrows', 'column: (shell, held) => animatedColumnArrows'),
              aside('// each starts where the other now sits')
            ]}/>}
          <Snippet label="CSS" lines={[
            ...unit(cssSource, '.sortable .displaced {'),
            aside('/* the pointer track’s keyframe, unchanged; --toward flips the sign */')
          ]}/>
        </Codes>
      </Step>
      <Step title="Let the slide pace the key">
        <Words want="The trader holds the arrow, and autorepeat must not outrun the slide: nudges landing mid-flight would outrun the theater.">
          <Says>The reflex is a timer: block the keys for however long the slide takes, and hope
            the number matches the CSS.</Says>
          <Says>There are no timers in this step: before nudging, ask the element whether an
            animation is still
            running; <Mdn path="Web/API/Element/getAnimations">getAnimations</Mdn> is the platform’s
            own record of the slide. While one runs, the key falls silent; the moment it ends, the
            next repeat lands. The animation is the debounce clock, and CSS already set its
            length.</Says>
        </Words>
        <Codes>
          <Snippet label="TS" lines={[
            ...span(travelSource, 'if (th.getAnimations().length > 0) {', '}'),
            aside('// while the slide runs, the key falls silent')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(cssSource, '.sortable .displaced {'),
            aside('/* the 200ms IS the debounce interval */')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
