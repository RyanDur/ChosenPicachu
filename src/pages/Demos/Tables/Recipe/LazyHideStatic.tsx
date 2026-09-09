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
  hideOrigin,
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
import buildSrc from '../Frame/builds/LazyHideStatic.ts?raw';
import tableSource from '../Builds/LazyHideStaticTable/LazyHideStaticTable.tsx?raw';
import headerSource from '../Builds/LazyHideStaticTable/DraggableColumn.tsx?raw';
import rowSource from '../Builds/LazyHideStaticTable/RowHeader.tsx?raw';
import paceSource from '../Builds/LazyHideStaticTable/travel.ts?raw';
import cssSource from '../Builds/LazyHideStaticTable/LazyHideStaticTable.css?raw';

export const LazyHideStaticRecipe: FC<{track: Track; world: World}> = ({track, world}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={9}
           can="The trader can sort by column"
           soThat="the measures they compare sit beside each other">
      {twoRoads}
      {theImplementation(world, 'Builds/LazyHideStaticTable', 'Frame/builds/LazyHideStatic.ts')}
      {theWholeBuild(world, tableSource, buildSrc)}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('lazy', 'hide', 'static')}
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource, buildSrc)}
        {listenersOnce(world, buildSrc)}
        {liftOnce(world, headerSource, buildSrc)}
        {dragSurface(world, headerSource, buildSrc)}
        {deadZone}
        {lazyPace(world, headerSource, paceSource, buildSrc)}
        {hideOrigin(world, headerSource, cssSource, buildSrc)}
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
      {theImplementation(world, 'Builds/LazyHideStaticTable', 'Frame/builds/LazyHideStatic.ts')}
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
