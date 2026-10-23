import {FC} from 'react';
import {Motion, Origin} from '../../Controls';
import {Steps, Story} from '../../Recipe';
import {
  Track,
  World,
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
import buildSrc from '../Frame/builds/Eager.ts?sample';
import tableSource from '../Builds/EagerTable/EagerTable.tsx?sample';
import headerSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import rowSource from '@components/DragSortableTable/RowHeader.tsx?sample';

import cssSource from '@components/DragSortableTable/motion.css?sample';

type Props = {track: Track; world: World; origin: Origin; motion: Motion};

export const EagerRecipe: FC<Props> = ({track, world, origin, motion}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
      can="The trader can sort by column"
      soThat="the measures they compare sit beside each other">
      <NamesInTheCode/>
      <TwoRoads/>
      <TheImplementation world={world} react="Builds/EagerTable" vanilla="Frame/builds/Eager.ts"/>
      <TheWholeBuild world={world} tableSource={tableSource} buildSrc={buildSrc}/>
      <AgainstTheStream/>
      <OwnedPixels world={world}/>
      <Promises pace="eager" origin={origin} motion={motion}/>
      <Steps>
        <CssShare world={world}/>
        <OrderInState world={world} tableSource={tableSource} buildSrc={buildSrc}/>
        <ListenersOnce world={world} buildSrc={buildSrc}/>
        <LiftOnce world={world} headerSource={headerSource} buildSrc={buildSrc}/>
        <DragSurface world={world} headerSource={headerSource}/>
        <DeadZone/>
        <EagerPace world={world} headerSource={headerSource} buildSrc={buildSrc}/>
        {origin === 'hide'
          ? <HideOrigin world={world} headerSource={headerSource} cssSource={cssSource} buildSrc={buildSrc}/>
          : <KeepOrigin world={world} cssSource={cssSource}/>}
        {motion === 'animated'
          ? <AnimatedMotion world={world} headerSource={headerSource} cssSource={cssSource} buildSrc={buildSrc}/>
          : <StaticMotion world={world} cssSource={cssSource}/>}
      </Steps>
    </Story>
    <Story param="sort" id="row"
      can="The trader can sort by row"
      soThat="the windows they watch closest sit on top">
      <TurnedVertical/>
      <Steps>
        <CarryVertical world={world} rowSource={rowSource} buildSrc={buildSrc}/>
      </Steps>
    </Story>
  </>
  : <>
    <Story param="sort" id="column"
      can="The trader can sort by column"
      soThat="the measures they compare sit beside each other">
      <NamesInTheCode/>
      <AccessTrack/>
      <TheImplementation world={world} react="Builds/EagerTable" vanilla="Frame/builds/Eager.ts"/>
      <QuietDials/>
      <Steps>
        <FocusLands world={world} headerSource={headerSource}/>
        <ArrowsSpeak world={world} headerSource={headerSource} buildSrc={buildSrc}/>
        {motion === 'animated'
          ? <WalkSlides world={world} headerSource={headerSource} buildSrc={buildSrc}/>
          : <CutKey world={world} headerSource={headerSource} buildSrc={buildSrc}/>}
      </Steps>
    </Story>
    <Story param="sort" id="row"
      can="The trader can sort by row"
      soThat="the windows they watch closest sit on top">
      <Steps>
        <GripArrows world={world} rowSource={rowSource} buildSrc={buildSrc}/>
      </Steps>
    </Story>
  </>;
