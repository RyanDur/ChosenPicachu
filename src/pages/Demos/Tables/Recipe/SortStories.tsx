import {FC} from 'react';
import {useControls} from '../../Controls';
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
  FocusLands,
  GripArrows,
  HideOrigin,
  KeepOrigin,
  LiftOnce,
  ListenersOnce,
  OrderInState,
  OwnedPixels,
  TableGuarantees,
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
import {SortBuild} from './sort-build';
import cssSource from '@components/DragSortableTable/motion.css?sample';

export const SortStories: FC<{build: SortBuild}> = ({build}) => {
  const {react, vanilla, tableSource, buildSource, headerSource, rowSource, paceStep} = build;
  const {track, origin, motion} = useControls();
  return track === 'pointer'
    ? <>
      <Story titleId="sort-column-story"
        can="The trader can sort by column"
        soThat="the measures they compare sit beside each other">
        <NamesInTheCode/>
        <TwoRoads/>
        <TheImplementation react={react} vanilla={vanilla}/>
        <TheWholeBuild tableSource={tableSource} buildSource={buildSource}/>
        <AgainstTheStream/>
        <OwnedPixels/>
        <TableGuarantees/>
        <Steps>
          <CssShare/>
          <OrderInState tableSource={tableSource} buildSource={buildSource}/>
          <ListenersOnce buildSource={buildSource}/>
          <LiftOnce headerSource={headerSource} buildSource={buildSource}/>
          <DragSurface headerSource={headerSource}/>
          <DeadZone/>
          {paceStep}
          {origin === 'hide'
            ? <HideOrigin headerSource={headerSource} cssSource={cssSource} buildSource={buildSource}/>
            : <KeepOrigin cssSource={cssSource}/>}
          {motion === 'animated'
            ? <AnimatedMotion headerSource={headerSource} cssSource={cssSource} buildSource={buildSource}/>
            : <StaticMotion cssSource={cssSource}/>}
        </Steps>
      </Story>
      <Story titleId="sort-row-story"
        can="The trader can sort by row"
        soThat="the lookbacks they watch closest sit on top">
        <TurnedVertical/>
        <Steps>
          <CarryVertical rowSource={rowSource} buildSource={buildSource}/>
        </Steps>
      </Story>
    </>
    : <>
      <Story titleId="sort-column-story"
        can="The trader can sort by column"
        soThat="the measures they compare sit beside each other">
        <NamesInTheCode/>
        <AccessTrack/>
        <TheImplementation react={react} vanilla={vanilla}/>
        <QuietDials/>
        <Steps>
          <FocusLands headerSource={headerSource}/>
          <ArrowsSpeak headerSource={headerSource} buildSource={buildSource}/>
          {motion === 'animated'
            ? <WalkSlides headerSource={headerSource} buildSource={buildSource}/>
            : <CutKey headerSource={headerSource} buildSource={buildSource}/>}
        </Steps>
      </Story>
      <Story titleId="sort-row-story"
        can="The trader can sort by row"
        soThat="the lookbacks they watch closest sit on top">
        <Steps>
          <GripArrows rowSource={rowSource} buildSource={buildSource}/>
        </Steps>
      </Story>
    </>;
};
