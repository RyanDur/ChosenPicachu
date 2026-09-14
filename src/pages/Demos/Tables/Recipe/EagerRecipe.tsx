import {FC} from 'react';
import {Motion, Origin} from '../../Controls';
import {Steps, Story} from '../../Recipe';
import {
  Track,
  World,
  accessTrack,
  againstTheStream,
  animatedMotion,
  arrowsSpeak,
  cssShare,
  cutKey,
  deadZone,
  dragSurface,
  eagerPace,
  focusLands,
  gripArrows,
  hideOrigin,
  keepOrigin,
  liftOnce,
  listenersOnce,
  orderInState,
  ownedPixels,
  promises,
  quietDials,
  carryVertical,
  staticMotion,
  turnedVertical,
  theImplementation,
  theWholeBuild,
  twoRoads,
  walkSlides
} from './steps';
import buildSrc from '../Frame/builds/Eager.ts?raw';
import tableSource from '../Builds/EagerTable/EagerTable.tsx?raw';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?raw';
import rowSource from '@components/DragSortableTable/RowHeader.tsx?raw';

import cssSource from '@components/DragSortableTable/motion.css?raw';

type Props = {track: Track; world: World; origin: Origin; motion: Motion};

export const EagerRecipe: FC<Props> = ({track, world, origin, motion}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column" steps={9}
      can="The trader can sort by column"
      soThat="the measures they compare sit beside each other">
      {twoRoads}
      {theImplementation(world, 'Builds/EagerTable', 'Frame/builds/Eager.ts')}
      {theWholeBuild(world, tableSource, buildSrc)}
      {againstTheStream}
      {ownedPixels(world)}
      {promises('eager', origin, motion)}
      <Steps>
        {cssShare(world)}
        {orderInState(world, tableSource, buildSrc)}
        {listenersOnce(world, buildSrc)}
        {liftOnce(world, headerSource, buildSrc)}
        {dragSurface(world, headerSource, buildSrc)}
        {deadZone}
        {eagerPace(world, headerSource, buildSrc)}
        {origin === 'hide' ? hideOrigin(world, headerSource, cssSource, buildSrc) : keepOrigin(world, cssSource)}
        {motion === 'animated' ? animatedMotion(world, headerSource, cssSource, buildSrc) : staticMotion(world, cssSource)}
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
      {theImplementation(world, 'Builds/EagerTable', 'Frame/builds/Eager.ts')}
      {quietDials}
      <Steps>
        {focusLands(world, headerSource, buildSrc)}
        {arrowsSpeak(world, headerSource, buildSrc)}
        {motion === 'animated' ? walkSlides(world, headerSource, buildSrc) : cutKey(world, headerSource, buildSrc)}
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
