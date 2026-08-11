import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Steps, Story, Tell, Words, aside} from '../../Recipe';
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
