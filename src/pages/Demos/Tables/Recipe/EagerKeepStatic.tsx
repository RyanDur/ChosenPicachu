import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  Track,
  World,
  accessTrack,
  againstTheStream,
  arrowsSpeak,
  cssShare,
  cutKey,
  deadZone,
  dragSurface,
  eagerPace,
  focusLands,
  gripArrows,
  ghostByHand,
  keepOrigin,
  liftOnce,
  listenersOnce,
  orderInState,
  ownedPixels,
  promises,
  quietDials,
  staticMotion,
  carryVertical,
  turnedVertical,
  twoRoads
} from './shared-steps';
import buildSrc from '../Frame/builds/EagerKeepStatic.ts?raw';
import rowSource from '@components/DragSortableTable/EagerKeepStaticTable/Cell.tsx?raw';
import tableSource from '@components/DragSortableTable/EagerKeepStaticTable/EagerKeepStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerKeepStaticTable/DraggableColumn.tsx?raw';

export const EagerKeepStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('eager', 'keep', 'static')}
      <Steps>
        {cssShare(world)}
        {orderInState(world)}
        {listenersOnce(world, tableSource)}
        {liftOnce(world, headerSource)}
        {dragSurface(world, tableSource)}
        {ghostByHand(world, tableSource)}
        {deadZone}
        {eagerPace(world, tableSource, buildSrc)}
        {keepOrigin(world)}
        {staticMotion(world, tableSource)}
      </Steps>
    </Story>
    <Story param="sort" id="row" steps={1}
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      {turnedVertical}
      <Steps>
        {carryVertical(world, tableSource)}
      </Steps>
    </Story>
  </>
  : <>
    <Story param="sort" id="column" steps={3}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {accessTrack}
      {quietDials}
      <Steps>
      {focusLands(world, headerSource)}
      {arrowsSpeak(world, headerSource)}
      {cutKey(world, headerSource, buildSrc)}
      </Steps>
    </Story>
    <Story param="sort" id="row" steps={1}
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      <Steps>
        {gripArrows(world, rowSource, buildSrc, 'staticRowArrows')}
      </Steps>
    </Story>
  </>;
