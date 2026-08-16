import {FC} from 'react';
import {MotionDial, OriginDial, PaceDial} from '../../Controls';
import {Codes, Says, Snippet, Step, Steps, Story, Tell, Words, aside, plain} from '../../Recipe';
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
  frameStand,
  gap,
  ghostByHand,
  liftOnce,
  orderInState,
  ownedPixels,
  quietDials,
  surveySource,
  theaterVertical,
  travelSource,
  turnedVertical,
  twoRoads
} from './shared-steps';
import shellSrc from '../Frame/shells/EagerKeepStatic.ts?raw';
import tableSource from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerKeepStaticTable/Header.tsx?raw';
import hookSource from '@components/DragSortableTable/EagerKeepStaticTable/useColumnTravel.ts?raw';

export const EagerKeepStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      <Tell>This particular table keeps three more promises.
        The sort happens while you drag, so a wrong grab costs nothing.
        The column stays in sight while its copy travels, so nothing vanishes while you decide.
        And the swap lands instantly, with no motion, so nothing competes with the pointer.</Tell>
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource)}
        {liftOnce(world, hookSource, tableSource, shellSrc)}
        {dragSurface(world, hookSource)}
        {ghostByHand(world, hookSource)}
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
                ...unit(hookSource, 'const travel = ')
              ]}/>
              : <Snippet label="TS" lines={[
                ...span(shellSrc, 'travel: moving => {', 'commit(held, struck')
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
              ...unit(surveySource, 'export const nudgedColumn'), gap,
              ...span(headerSource, 'const {from, to} = nudgedColumn(order, columnName, toward);', 'onOrdered(columnName, to);'),
              aside('// the whole walk; nothing marked, nothing to wait for')
            ]}/>
            : <Snippet label="TS" lines={[
              ...unit(surveySource, 'export const nudgedColumn'), gap,
              ...span(shellSrc, 'const {from, to} = nudgedColumn(order, held, toward);', 'shell.commit(orderedTo(from, to));'),
              aside('// the whole walk; nothing marked, nothing to wait for')
            ]}/>}
        </Codes>
      </Step>
    </Steps>
  </Story>;
