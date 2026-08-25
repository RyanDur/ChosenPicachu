import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  Track,
  World,
  accessTrack,
  againstTheStream,
  animatedMotion,
  arrowsSpeak,
  bothSlide,
  cssShare,
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
  paceKey,
  promises,
  quietDials,
  carryVertical,
  turnedVertical,
  twoRoads
} from './shared-steps';
import buildSrc from '../Frame/builds/EagerKeepAnimated.ts?raw';
import rowSource from '@components/DragSortableTable/EagerKeepAnimatedTable/Cell.tsx?raw';
import tableSource from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerKeepAnimatedTable/DraggableColumn.tsx?raw';
import cssSource from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.css?raw';

export const EagerKeepAnimatedRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('eager', 'keep', 'animated')}
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
        {animatedMotion(world, tableSource, cssSource)}
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
    <Story param="sort" id="column" steps={4}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {accessTrack}
      {quietDials}
      <Steps>
      {focusLands(world, headerSource)}
      {arrowsSpeak(world, headerSource)}
      {bothSlide(world, headerSource, buildSrc, cssSource)}
      {paceKey(cssSource)}
      </Steps>
    </Story>
    <Story param="sort" id="row" steps={1}
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      <Steps>
        {gripArrows(world, rowSource, buildSrc, 'animatedRowArrows')}
      </Steps>
    </Story>
  </>;
