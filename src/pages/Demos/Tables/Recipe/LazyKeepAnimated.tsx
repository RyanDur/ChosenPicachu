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
  keepOrigin,
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
import buildSrc from '../Frame/builds/LazyKeepAnimated.ts?raw';
import tableSource from '../Builds/LazyKeepAnimatedTable/LazyKeepAnimatedTable.tsx?raw';
import headerSource from '../Builds/LazyKeepAnimatedTable/DraggableColumn.tsx?raw';
import rowSource from '../Builds/LazyKeepAnimatedTable/RowHeader.tsx?raw';
import paceSource from '../Builds/LazyKeepAnimatedTable/travel.ts?raw';
import cssSource from '../Builds/LazyKeepAnimatedTable/LazyKeepAnimatedTable.css?raw';

export const LazyKeepAnimatedRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {theImplementation(world, 'Builds/LazyKeepAnimatedTable', 'Frame/builds/LazyKeepAnimated.ts')}
      {theWholeBuild(world, tableSource, buildSrc)}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'keep', 'animated')}
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource, buildSrc)}
        {listenersOnce(world, buildSrc)}
        {liftOnce(world, headerSource, buildSrc)}
        {dragSurface(world, headerSource, buildSrc)}
        {deadZone}
        {lazyPace(world, headerSource, paceSource, buildSrc)}
        {keepOrigin(world)}
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
      {theImplementation(world, 'Builds/LazyKeepAnimatedTable', 'Frame/builds/LazyKeepAnimated.ts')}
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
