import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
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
import shellSrc from '../Frame/shells/LazyKeepStatic.ts?raw';
import tableSource from '@components/DragSortableTable/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyKeepStaticTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/LazyKeepStaticTable/useColumnTravel.ts?raw';

export const LazyKeepStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      <Tell>This particular table keeps three more promises.
        The table holds calm and the sort lands on the drop, so only the destination matters.
        The column stays in sight while its copy travels, so nothing vanishes while you decide.
        And the swap lands instantly, with no motion, so nothing competes with the pointer.</Tell>
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource)}
        {liftOnce(world, hookSource, tableSource, shellSrc)}
        {dragSurface(world, hookSource)}
        {ghostByHand(world, hookSource)}
        {deadZone}
        <Step title="Stash the landing, commit on release" dial={<PaceDial name="step-pace"/>}>
          <Words want="The trader wants the table calm while they drag, because mid-flight churn distracts and only the destination matters.">
            {world === 'react'
              ? <Says>With lazy pace, remember the last neighbour struck and do nothing else. The table
                holds still, and one moveToIndex runs on pointer up. Drifting back over your own slot
                clears the landing, so a drop at home changes nothing.</Says>
              : <Says>With lazy pace, remember the last neighbour struck and do nothing else. The table
                holds still, and one commit runs at the landing. Drifting back over your own slot
                clears the landing, so a drop at home changes nothing.</Says>}
            {world === 'react'
              ? <Says>The lazy hook is its own handler, not a flag on the eager one: a strike is only ever
                remembered as the landing, and drop, which also answers cancel and a lost capture,
                commits it.</Says>
              : <Says>The lazy shell is its own file, not a flag on the eager one: the flight folds every
                move into a carried landing, and the land of the flight, which also answers cancel and
                a lost capture, commits whatever the fold is holding.</Says>}
          </Words>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(hookSource, 'const travel = '), gap,
                ...unit(hookSource, 'const drop = ')
              ]}/>
              : <Snippet label="TS" lines={[
                ...span(shellSrc, 'travel: (moving, landing) => {', 'commit(columnOf(shell.desk(), th), struck')
              ]}/>}
          </Codes>
        </Step>
        <Step title="Leave the origin in place while it is aloft" dial={<OriginDial name="step-origin"/>}>
          <Words want="A vanished origin can disorient; some traders want the column both at rest and in hand while they decide.">
            {world === 'react'
              ? <Says>Render the lifted key normally underneath the ghost. There are two of it for the
                length of the drag, which reads as a copy being carried out of a still-intact table.
                This is the keep table: no hiding code exists in it, so there is nothing to erase.</Says>
              : <Says>The lifted column simply stays painted underneath the ghost. There are two of it
                for the length of the drag, which reads as a copy being carried out of a still-intact
                table. This is the keep shell: no hiding code exists in it, so there is nothing to
                erase.</Says>}
          </Words>
          <Codes>
            <Snippet label="HTML" lines={[
              aside(world === 'react'
                ? '{/* no hidden wiring exists in this table; nothing to erase */}'
                : '<!-- no hiding code exists in this shell; nothing to erase -->')
            ]}/>
          </Codes>
        </Step>
        <Step title="Apply the state update directly" dial={<MotionDial name="step-motion"/>}>
          <Words want="Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.">
            {world === 'react'
              ? <Says>The static table is not the animated one with a switch off; it is a different
                table with no marking code in it. Its settle is the whole story: move the key, let
                React paint, and there is nothing else, because nothing else exists in this file.
                There is real value in this mode beyond taste: nothing competes with the pointer, and
                no motion for prefers-reduced-motion users to endure.</Says>
              : <Says>The static shell is not the animated one with a switch off; it is a different
                file with no marking code in it. Its commit is the whole story: a new order on the
                desk, the reconcile moves the cells, and there is nothing else, because nothing else
                exists in this file. There is real value in this mode beyond taste: nothing competes
                with the pointer, and no motion for prefers-reduced-motion users to endure.</Says>}
          </Words>
          <Codes>
            {world === 'react'
              ? <Snippet label="TS" lines={[
                ...unit(tableSource, 'const settleColumn = '),
                aside('// the whole settle; no marking code exists in this table')
              ]}/>
              : <Snippet label="TS" lines={[
                ...unit(shellSrc, 'const commit = (held: string'),
                aside('// the whole settle; no marking code exists in this shell')
              ]}/>}
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
      {arrowsSpeak(world, headerSource, shellSrc)}
      <Step title="Cut on the keypress" dial={<MotionDial name="step-motion"/>}>
        <Words want="Motion is not free, a held key multiplies it, and some traders ask for none at all.">
          <Says>Apply the order and mark nothing; the swap paints on the next frame. With no
            animation running there is nothing to pace, so a held arrow walks the column exactly as
            fast as the key repeats.</Says>
        </Words>
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...span(headerSource, 'const from = order.indexOf(columnName);', 'onOrdered(columnName, to);'),
              aside('// the whole walk; nothing marked, nothing to wait for')
            ]}/>
            : <Snippet label="TS" lines={[
              ...span(shellSrc, 'const from = order.indexOf(held);', 'shell.commit(orderedTo(from, to));'),
              aside('// the whole walk; nothing marked, nothing to wait for')
            ]}/>}
        </Codes>
      </Step>
    </Steps>
  </Story>;
