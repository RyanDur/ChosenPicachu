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
  focusLands,
  gripArrows,
  ghostByHand,
  keepOrigin,
  lazyPace,
  liftOnce,
  listenersOnce,
  orderInState,
  ownedPixels,
  promises,
  quietDials,
  staticMotion,
  theaterVertical,
  turnedVertical,
  twoRoads
} from './shared-steps';
import buildSrc from '../Frame/builds/LazyKeepStatic.ts?raw';
import rowSource from '@components/DragSortableTable/LazyKeepStaticTable/Row.tsx?raw';
import tableSource from '@components/DragSortableTable/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyKeepStaticTable/Header.tsx?raw';

export const LazyKeepStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'keep', 'static')}
      <Steps>
        {cssShare(world)}
        {orderInState(world)}
        {listenersOnce(world, tableSource)}
        {liftOnce(world, tableSource)}
        {dragSurface(world, tableSource)}
        {ghostByHand(world, tableSource)}
        {deadZone}
        {lazyPace(world, tableSource, buildSrc)}
        {keepOrigin(world)}
        {staticMotion(world, tableSource)}
      </Steps>
    </Story>
    <Story param="sort" id="row" steps={1}
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      {turnedVertical}
      <Steps>
        {theaterVertical(world, tableSource)}
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
