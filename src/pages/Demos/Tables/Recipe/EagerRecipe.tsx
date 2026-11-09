import {FC} from 'react';
import {Motion, Origin} from '../../Controls';
import {Steps, Story} from '../../Recipe';
import type {Track, World} from '../../Controls';
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

type Props = {track: Track; world: World; origin: Origin; motion: Motion};

export const EagerRecipe: FC<Props> = ({track, world, origin, motion}) => track === 'pointer'
  ? <>
    <Story param="sort" id="column"
      can="The trader can sort by column"
      soThat="the measures they compare sit beside each other">
      <NamesInTheCode/>
      <TwoRoads/>
      <TheImplementation world={world} react="Builds/EagerTable" vanilla="Frame/builds/Eager.ts"/>
      <TheWholeBuild world={world} tableSource={tableSource} buildSource={buildSource}/>
      <AgainstTheStream/>
      <OwnedPixels world={world}/>
      <Promises pace="eager" origin={origin} motion={motion}/>
      <Steps>
        <CssShare world={world}/>
        <OrderInState world={world} tableSource={tableSource} buildSource={buildSource}/>
        <ListenersOnce world={world} buildSource={buildSource}/>
        <LiftOnce world={world} headerSource={headerSource} buildSource={buildSource}/>
        <DragSurface world={world} headerSource={headerSource}/>
        <DeadZone/>
        <EagerPace world={world} headerSource={headerSource} buildSource={buildSource}/>
        {origin === 'hide'
          ? <HideOrigin world={world} headerSource={headerSource} cssSource={cssSource} buildSource={buildSource}/>
          : <KeepOrigin world={world} cssSource={cssSource}/>}
        {motion === 'animated'
          ? <AnimatedMotion world={world} headerSource={headerSource} cssSource={cssSource} buildSource={buildSource}/>
          : <StaticMotion world={world} cssSource={cssSource}/>}
      </Steps>
    </Story>
    <Story param="sort" id="row"
      can="The trader can sort by row"
      soThat="the lookbacks they watch closest sit on top">
      <TurnedVertical/>
      <Steps>
        <CarryVertical world={world} rowSource={rowSource} buildSource={buildSource}/>
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
        <ArrowsSpeak world={world} headerSource={headerSource} buildSource={buildSource}/>
        {motion === 'animated'
          ? <WalkSlides world={world} headerSource={headerSource} buildSource={buildSource}/>
          : <CutKey world={world} headerSource={headerSource} buildSource={buildSource}/>}
      </Steps>
    </Story>
    <Story param="sort" id="row"
      can="The trader can sort by row"
      soThat="the lookbacks they watch closest sit on top">
      <Steps>
        <GripArrows world={world} rowSource={rowSource} buildSource={buildSource}/>
      </Steps>
    </Story>
  </>;
