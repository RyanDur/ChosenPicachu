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
  focusLands,
  ghostByHand,
  keepOrigin,
  lazyPace,
  liftOnce,
  orderInState,
  ownedPixels,
  paceKey,
  promises,
  quietDials,
  theaterVertical,
  turnedVertical,
  twoRoads
} from './shared-steps';
import buildSrc from '../Frame/builds/LazyKeepAnimated.ts?raw';
import tableSource from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyKeepAnimatedTable/Header.tsx?raw';
import cssSource from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.css?raw';

export const LazyKeepAnimatedRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'keep', 'animated')}
      <Steps>
        {cssShare(world)}
        {orderInState(world)}
        {liftOnce(world, tableSource)}
        {dragSurface(world, tableSource)}
        {ghostByHand(world, tableSource)}
        {deadZone}
        {lazyPace(world, tableSource, buildSrc)}
        {keepOrigin(world)}
        {animatedMotion(world, tableSource, cssSource)}
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
      {bothSlide(world, headerSource, buildSrc, cssSource)}
      {paceKey(cssSource)}
    </Steps>
  </Story>;
