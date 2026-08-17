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
  ghostByHand,
  hideOrigin,
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
import buildSrc from '../Frame/builds/LazyHideStatic.ts?raw';
import tableSource from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyHideStaticTable/Header.tsx?raw';
import cssSource from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';

export const LazyHideStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'hide', 'static')}
      <Steps>
        {cssShare(world)}
        {orderInState(world)}
        {listenersOnce(world, tableSource)}
        {liftOnce(world, tableSource)}
        {dragSurface(world, tableSource)}
        {ghostByHand(world, tableSource)}
        {deadZone}
        {lazyPace(world, tableSource, buildSrc)}
        {hideOrigin(world, tableSource, headerSource, cssSource)}
        {staticMotion(world, tableSource)}
      </Steps>
    </Story>
    <Story param="sort" id="row"
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      {turnedVertical}
      <Steps>
        {theaterVertical(world, tableSource)}
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
      {arrowsSpeak(world, headerSource)}
      {cutKey(world, headerSource, buildSrc)}
    </Steps>
  </Story>;
