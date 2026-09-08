import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  Track,
  World,
  accessTrack,
  againstTheStream,
  animatedMotion,
  arrowsSpeak,
  cssShare,
  deadZone,
  dragSurface,
  focusLands,
  gripArrows,
  hideOrigin,
  lazyPace,
  liftOnce,
  listenersOnce,
  orderInState,
  ownedPixels,
  promises,
  quietDials,
  carryVertical,
  turnedVertical,
  theImplementation,
  theWholeBuild,
  twoRoads,
  walkSlides
} from './shared-steps';
import buildSrc from '../Frame/builds/LazyHideAnimated.ts?raw';
import tableSource from '../Builds/LazyHideAnimatedTable/LazyHideAnimatedTable.tsx?raw';
import headerSource from '../Builds/LazyHideAnimatedTable/DraggableColumn.tsx?raw';
import rowSource from '../Builds/LazyHideAnimatedTable/RowHeader.tsx?raw';
import paceSource from '../Builds/LazyHideAnimatedTable/travel.ts?raw';
import cssSource from '../Builds/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';

export const LazyHideAnimatedRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {theImplementation(world, 'Builds/LazyHideAnimatedTable', 'Frame/builds/LazyHideAnimated.ts')}
      {theWholeBuild(world, tableSource, buildSrc)}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'hide', 'animated')}
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource, buildSrc)}
        {listenersOnce(world, buildSrc)}
        {liftOnce(world, headerSource, buildSrc)}
        {dragSurface(world, headerSource, buildSrc)}
        {deadZone}
        {lazyPace(world, headerSource, paceSource, buildSrc)}
        {hideOrigin(world, headerSource, cssSource, buildSrc)}
        {animatedMotion(world, headerSource, cssSource, buildSrc)}
      </Steps>
    </Story>
    <Story param="sort" id="row" steps={1}
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      {turnedVertical}
      <Steps>
        {carryVertical(world, rowSource, buildSrc)}
      </Steps>
    </Story>
  </>
  : <>
    <Story param="sort" id="column" steps={3}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {accessTrack}
      {theImplementation(world, 'Builds/LazyHideAnimatedTable', 'Frame/builds/LazyHideAnimated.ts')}
      {quietDials}
      <Steps>
      {focusLands(world, headerSource, buildSrc)}
      {arrowsSpeak(world, headerSource, buildSrc)}
      {walkSlides(world, headerSource, buildSrc)}
      </Steps>
    </Story>
    <Story param="sort" id="row" steps={1}
           can="The trader can sort by row"
           soThat="the windows they watch closest sit on top">
      <Steps>
        {gripArrows(world, rowSource, buildSrc)}
      </Steps>
    </Story>
  </>;
