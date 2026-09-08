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
  keepOrigin,
  lazyPace,
  liftOnce,
  listenersOnce,
  orderInState,
  ownedPixels,
  promises,
  quietDials,
  staticMotion,
  carryVertical,
  turnedVertical,
  theImplementation,
  theWholeBuild,
  twoRoads
} from './shared-steps';
import buildSrc from '../Frame/builds/LazyKeepStatic.ts?raw';
import tableSource from '../Builds/LazyKeepStaticTable/LazyKeepStaticTable.tsx?raw';
import headerSource from '../Builds/LazyKeepStaticTable/DraggableColumn.tsx?raw';
import rowSource from '../Builds/LazyKeepStaticTable/RowHeader.tsx?raw';
import paceSource from '../Builds/LazyKeepStaticTable/travel.ts?raw';

export const LazyKeepStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={10}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {theImplementation(world, 'Builds/LazyKeepStaticTable', 'Frame/builds/LazyKeepStatic.ts')}
      {theWholeBuild(world, tableSource, buildSrc)}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'keep', 'static')}
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource, buildSrc)}
        {listenersOnce(world, buildSrc)}
        {liftOnce(world, headerSource, buildSrc)}
        {dragSurface(world, headerSource, buildSrc)}
        {deadZone}
        {lazyPace(world, headerSource, paceSource, buildSrc)}
        {keepOrigin(world)}
        {staticMotion(world, headerSource, buildSrc)}
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
      {theImplementation(world, 'Builds/LazyKeepStaticTable', 'Frame/builds/LazyKeepStatic.ts')}
      {quietDials}
      <Steps>
      {focusLands(world, headerSource, buildSrc)}
      {arrowsSpeak(world, headerSource, buildSrc)}
      {cutKey(world, headerSource, buildSrc)}
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
