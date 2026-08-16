import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
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
import shellSrc from '../Frame/shells/LazyHideStatic.ts?raw';
import tableSource from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyHideStaticTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/LazyHideStaticTable/useColumnTravel.ts?raw';
import cssSource from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';

export const LazyHideStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      <Tell>This particular table keeps three more promises.
        The table holds calm and the sort lands on the drop, so only the destination matters.
        A gap opens where the column left, so the landing is never a guess.
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
            <Snippet label="TS" lines={[
              ...unit(travelSource, 'export const lazyTravel'),
              aside('// one travel ruling; the fold is its value, each world keeps it its own way')
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
              ...unit(travelSource, 'export const staticColumnArrows'), gap,
              ...unit(headerSource, 'const ordered = '), gap,
              ...span(headerSource, 'onKeyDown={travels ? staticColumnArrows', 'onKeyDown={travels ? staticColumnArrows'),
              aside('// the whole walk; nothing marked, nothing to wait for')
            ]}/>
            : <Snippet label="TS" lines={[
              ...unit(travelSource, 'export const staticColumnArrows'), gap,
              ...unit(shellSrc, '  const ordered = '), gap,
              ...span(shellSrc, "th.addEventListener('keydown', staticColumnArrows", "th.addEventListener('keydown', staticColumnArrows"),
              aside('// the whole walk; nothing marked, nothing to wait for')
            ]}/>}
        </Codes>
      </Step>
    </Steps>
  </Story>;
