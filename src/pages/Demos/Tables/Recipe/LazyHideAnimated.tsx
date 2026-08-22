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
  gripArrows,
  ghostByHand,
  hideOrigin,
  lazyPace,
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
import buildSrc from '../Frame/builds/LazyHideAnimated.ts?raw';
import rowSource from '@components/DragSortableTable/LazyHideAnimatedTable/Row.tsx?raw';
import tableSource from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import headerSource from '@components/DragSortableTable/LazyHideAnimatedTable/Header.tsx?raw';
import cssSource from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';

export const LazyHideAnimatedRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'hide', 'animated')}
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
