import {FC} from 'react';
import {Motion, useControls} from '../../Controls';
import {Steps, Story} from '../../Recipe';
import {
  AccessTrack,
  AgainstTheStream,
  AnimatedMotion,
  ArrowsSpeak,
  CssShare,
  CutKey,
  DeadZone,
  DragSurface,
  EagerPace,
  FocusLands,
  GripArrows,
  HideOrigin,
  KeepOrigin,
  LiftOnce,
  ListenersOnce,
  OrderInState,
  OwnedPixels,
  Promises,
  QuietDials,
  CarryVertical,
  StaticMotion,
  TurnedVertical,
  TheImplementation,
  TheWholeBuild,
  NamesInTheCode,
  TwoRoads,
  WalkSlides
} from './steps';
import buildSource from '../Frame/builds/Eager.ts?sample';
import tableSource from '../Builds/EagerTable/EagerTable.tsx?sample';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import rowSource from '@components/DragSortableTable/RowHeader.tsx?sample';

import cssSource from '@components/DragSortableTable/motion.css?sample';

type Props = {motion: Motion};

export const EagerRecipe: FC<Props> = ({motion}) => {
  const {track, origin} = useControls();
  return track === 'pointer'
    ? <>
      <Story param="sort" id="column"
        can="The trader can sort by column"
        soThat="the measures they compare sit beside each other">
        <NamesInTheCode/>
        <TwoRoads/>
        <TheImplementation react="Builds/EagerTable" vanilla="Frame/builds/Eager.ts"/>
        <TheWholeBuild tableSource={tableSource} buildSource={buildSource}/>
        <AgainstTheStream/>
        <OwnedPixels/>
        <Promises pace="eager" motion={motion}/>
        <Steps>
          <CssShare/>
          <OrderInState tableSource={tableSource} buildSource={buildSource}/>
          <ListenersOnce buildSource={buildSource}/>
          <LiftOnce headerSource={headerSource} buildSource={buildSource}/>
          <DragSurface headerSource={headerSource}/>
          <DeadZone/>
          <EagerPace headerSource={headerSource} buildSource={buildSource}/>
          {origin === 'hide'
            ? <HideOrigin headerSource={headerSource} cssSource={cssSource} buildSource={buildSource}/>
            : <KeepOrigin cssSource={cssSource}/>}
          {motion === 'animated'
            ? <AnimatedMotion headerSource={headerSource} cssSource={cssSource} buildSource={buildSource}/>
            : <StaticMotion cssSource={cssSource}/>}
        </Steps>
      </Story>
      <Story param="sort" id="row"
        can="The trader can sort by row"
        soThat="the lookbacks they watch closest sit on top">
        <TurnedVertical/>
        <Steps>
          <CarryVertical rowSource={rowSource} buildSource={buildSource}/>
        </Steps>
      </Story>
    </>
    : <>
      <Story param="sort" id="column"
        can="The trader can sort by column"
        soThat="the measures they compare sit beside each other">
        <NamesInTheCode/>
        <AccessTrack/>
        <TheImplementation react="Builds/EagerTable" vanilla="Frame/builds/Eager.ts"/>
        <QuietDials/>
        <Steps>
          <FocusLands headerSource={headerSource}/>
          <ArrowsSpeak headerSource={headerSource} buildSource={buildSource}/>
          {motion === 'animated'
            ? <WalkSlides headerSource={headerSource} buildSource={buildSource}/>
            : <CutKey headerSource={headerSource} buildSource={buildSource}/>}
        </Steps>
      </Story>
      <Story param="sort" id="row"
        can="The trader can sort by row"
        soThat="the lookbacks they watch closest sit on top">
        <Steps>
          <GripArrows rowSource={rowSource} buildSource={buildSource}/>
        </Steps>
      </Story>
    </>;
};
