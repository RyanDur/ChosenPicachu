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
import tableSource from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerHideStaticTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/EagerHideStaticTable/useColumnTravel.ts?raw';
import cssSource from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.css?raw';

export const EagerHideStaticRecipe: FC<{track: Track}> = ({track}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels}
      <Tell>This particular table keeps three more promises.
        The sort happens while you drag, so a wrong grab costs nothing.
        A gap opens where the column left, so the landing is never a guess.
        And the swap lands instantly, with no motion, so nothing competes with the pointer.</Tell>
      <Steps>
        {cssShare}
        {orderInState(tableSource)}
        {liftOnce(hookSource, tableSource)}
        {dragSurface(hookSource)}
        {ghostByHand(hookSource)}
        {deadZone}
        <Step title="Commit inside the move" dial={<PaceDial name="step-pace"/>}>
          <Words want="The trader wants the table to answer inside the move, so that they can change their mind before the drop.">
            <Says>With eager pace, settle as soon as a neighbour is struck: the order state updates
              mid-drag, and because the markup renders through that order, the same key finds its new
              seat and React moves the real cells. Carrying the column back is just more crossings:
              home is always reachable. No style changes hands here at all.</Says>
            <Says>This is the whole eager hook’s handler, and there is no landing state to keep anywhere
              in it: buttons at zero heals a drag whose release was swallowed, the surface claims the
              pointer capture, the drift feeds the ghost, and a strike settles on the spot.</Says>
          </Words>
          <Codes>
            <Snippet label="JS" lines={[
              ...unit(hookSource, 'const travel = ')
            ]}/>
            <Snippet label="HTML" lines={[
              plain('<DraggableHeader key={key} ... />'),
              aside('{/* same key, new seat: React moves the node, not a copy */}')
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
