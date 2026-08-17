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
  ghostByHand,
  hideOrigin,
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
import buildSrc from '../Frame/builds/EagerHideStatic.ts?raw';
import tableSource from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.tsx?raw';
import headerSource from '@components/DragSortableTable/EagerHideStaticTable/Header.tsx?raw';
import cssSource from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.css?raw';

export const EagerHideStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('eager', 'hide', 'static')}
      <Steps>
        {cssShare(world)}
        {orderInState(world)}
        {listenersOnce(world, tableSource)}
        {liftOnce(world, tableSource)}
        {dragSurface(world, tableSource)}
        {ghostByHand(world, tableSource)}
        {deadZone}
        {eagerPace(world, tableSource, buildSrc)}
        {hideOrigin(world, tableSource, headerSource, cssSource)}
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
  : <Story param="sort" id="keyboard" steps={3}
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
