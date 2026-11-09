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
  LazyPace,
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
import buildSource from '../Frame/builds/Lazy.ts?sample';
import tableSource from '../Builds/LazyTable/LazyTable.tsx?sample';
import headerSource from '../Builds/LazyTable/DraggableColumn.tsx?sample';
import rowSource from '../Builds/LazyTable/RowHeader.tsx?sample';
import paceSource from '../Builds/LazyTable/lazyDrop.ts?sample';
import cssSource from '@components/DragSortableTable/motion.css?sample';

type Props = {motion: Motion};

export const LazyRecipe: FC<Props> = ({motion}) => {
  const {track, origin} = useControls();
  return track === 'pointer'
    ? <>
      <Story param="sort" id="column"
        can="The trader can sort by column"
        soThat="the measures they compare sit beside each other">
        <NamesInTheCode/>
        <TwoRoads/>
        <TheImplementation react="Builds/LazyTable" vanilla="Frame/builds/Lazy.ts"/>
        <TheWholeBuild tableSource={tableSource} buildSource={buildSource}/>
        <AgainstTheStream/>
        <OwnedPixels/>
        <Promises pace="lazy" motion={motion}/>
        <Steps>
          <CssShare/>
          <OrderInState tableSource={tableSource} buildSource={buildSource}/>
          <ListenersOnce buildSource={buildSource}/>
          <LiftOnce headerSource={headerSource} buildSource={buildSource}/>
          <DragSurface headerSource={headerSource}/>
          <DeadZone/>
          <LazyPace headerSource={headerSource} paceSource={paceSource} buildSource={buildSource}/>
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
        <TheImplementation react="Builds/LazyTable" vanilla="Frame/builds/Lazy.ts"/>
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
