import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
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
  ghostByHand,
  liftOnce,
  orderInState,
  ownedPixels,
  quietDials,
  theaterVertical,
  turnedVertical,
  twoRoads
} from './shared-steps';
import tableSource from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerKeepStaticTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/EagerKeepStaticTable/useColumnTravel.ts?raw';

export const EagerKeepStaticRecipe: FC<{track: Track}> = ({track}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels}
      <Tell>This particular table keeps three more promises.
        The sort happens while you drag, so a wrong grab costs nothing.
        The column stays in sight while its copy travels, so nothing vanishes while you decide.
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
        <Step title="Leave the origin in place while it is aloft" dial={<OriginDial name="step-origin"/>}>
          <Words want="A vanished origin can disorient; some traders want the column both at rest and in hand while they decide.">
            <Says>Render the lifted key normally underneath the ghost. There are two of it for the
              length of the drag, which reads as a copy being carried out of a still-intact table.
              This is the keep table: no hiding code exists in it, so there is nothing to erase.</Says>
          </Words>
          <Codes>
            <Snippet label="HTML" lines={[
              aside('{/* no hidden wiring exists in this table; nothing to erase */}')
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
