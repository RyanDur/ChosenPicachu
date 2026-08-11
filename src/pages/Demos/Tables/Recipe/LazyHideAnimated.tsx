import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {
  Track,
  accessTrack,
  againstTheStream,
  arrowsSpeak,
  cssShare,
  deadZone,
  dragSurface,
  focusLands,
  gap,
  ghostByHand,
  liftOnce,
  orderInState,
  ownedPixels,
  quietDials,
  theaterVertical,
  turnedVertical,
  twoRoads
} from './shared-steps';
import tableSource from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyHideAnimatedTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/LazyHideAnimatedTable/useColumnTravel.ts?raw';
import cssSource from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';

export const LazyHideAnimatedRecipe: FC<{track: Track}> = ({track}) => track === 'pointer'
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
        And the swap slides into place, so the eye never loses a column.</Tell>
      <Steps>
        {cssShare}
        {orderInState(tableSource)}
        {liftOnce(hookSource, tableSource)}
        {dragSurface(hookSource)}
        {ghostByHand(hookSource)}
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
        <Step title="Slide the theater, not the layout" dial={<MotionDial name="step-motion"/>}>
          <Words want="The trader must be able to follow which column went where; a teleport is honest but unreadable, and animating the layout itself would bounce the whole table, because layout is load-bearing.">
            <Says>A swap commits instantly: the carried column already sits at full width in its new
              slot, hidden or under the ghost, and the layout underneath is final. The displaced column
              is merely drawn where it used to be, sliding home on
              a <Mdn path="Web/CSS/transform">transform</Mdn>. Transforms cannot move layout, so nothing
              else can shift: a bounce is impossible by construction.</Says>
            <Says>The three languages split the trick cleanly. JavaScript marks who was displaced and
              hands over two lengths it already owns, both measured by the survey: the carried
              column’s width and each row’s drop. The markup carries the mark as a class that arrives
              exactly as the reorder moves the node. CSS does all the moving:
              a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from is the old position, a pixel
              length the survey measured at the lift; applying the class starts the slide fresh,
              and <Mdn path="Web/API/Element/animationend_event">animationend</Mdn> hands the class
              back.</Says>
            <Says>Rows are the same theater turned vertical: heights measured once, in whatever event
              reorders them, become per-row pixel offsets, and every displaced row starts at
              translateY(var(--drop)) and slides home. Nothing in this table rides a view transition;
              every motion is a keyframe starting from where things used to be.</Says>
            <Says>Motion is not a flag on this table; it is this table. The animated variant marks its
              own theater inline in its settles, the dial above chooses which of eight tables you are
              reading, and the readout under the dials names it.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" lines={[
              ...unit(tableSource, 'const settleColumn = '),
              aside('// a direction and a share per displaced key; javascript is done')
            ]}/>
            <Snippet label="HTML" lines={[
              plain("<th className={displaced && `displaced-${toward}`} ... >"),
              plain("<tr className={drop && 'shifted'} style={{'--drop': `${drop}px`}}>"),
              aside('{/* the reorder moves the node; the class rides along */}')
            ]}/>
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
        {theaterVertical(tableSource)}
      </Steps>
    </Story>
  </>
  : <Story param="sort" id="keyboard"
           can="The trader can sort without a mouse"
           soThat="the table answers whoever arrives at it">
    {accessTrack}
    {quietDials}
    <Steps>
      {focusLands(headerSource)}
      {arrowsSpeak(headerSource)}
      <Step title="Both parties slide, each by the other’s share" dial={<MotionDial name="step-motion"/>}>
        <Words want="A pointer swap explains itself with a ghost in hand; the trader’s keyboard swap has no hand, and if only the neighbour slid, the walked column would simply teleport.">
          <Says>Mark both columns displaced. The swap still commits instantly, the same theater
            the pointer track built, but now each party is drawn starting from the seat it just
            left, offset by the other’s share, sliding home on the same keyframes. The classes
            arrive as the reorder moves the nodes, so both slides start fresh without a line of new CSS.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" lines={[
            ...span(headerSource, 'const neighbour = order[to];', '});'),
            aside('// each starts where the other now sits')
          ]}/>
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
          <Snippet label="JS" lines={[
            ...span(headerSource, 'if ((event.currentTarget.getAnimations', '}'),
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
