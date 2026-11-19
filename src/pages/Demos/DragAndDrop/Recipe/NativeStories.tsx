import {FC} from 'react';
import {Motion, Origin, useControls} from '../../Controls';
import {Pace} from '../../ReaderSettings';
import {Sample, Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  CommitCrossing,
  DirectState,
  FadeOrigin,
  HoldTheAloft,
  InnerHalf,
  KeepStanding,
  ListGuarantees,
  PlatformCurrency,
  RoadEnd,
  SlideCrossed,
  SlideSettle,
  StashLanding,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import keepItemSource from '../items/KeepItem.tsx?sample';
import hideItemSource from '../items/HideItem.tsx?sample';
import eagerKeepAnimated from '../EagerKeepAnimatedList.tsx?sample';
import eagerKeepStatic from '../EagerKeepStaticList.tsx?sample';
import eagerHideAnimated from '../EagerHideAnimatedList.tsx?sample';
import eagerHideStatic from '../EagerHideStaticList.tsx?sample';
import lazyKeepAnimated from '../LazyKeepAnimatedList.tsx?sample';
import lazyKeepStatic from '../LazyKeepStaticList.tsx?sample';
import lazyHideAnimated from '../LazyHideAnimatedList.tsx?sample';
import lazyHideStatic from '../LazyHideStaticList.tsx?sample';

const listSources: Record<Pace, Record<Origin, Record<Motion, Sample>>> = {
  eager: {
    keep: {animated: eagerKeepAnimated, static: eagerKeepStatic},
    hide: {animated: eagerHideAnimated, static: eagerHideStatic}
  },
  lazy: {
    keep: {animated: lazyKeepAnimated, static: lazyKeepStatic},
    hide: {animated: lazyHideAnimated, static: lazyHideStatic}
  }
};

const itemSources: Record<Origin, Sample> = {keep: keepItemSource, hide: hideItemSource};

export const NativeStories: FC = () => {
  const {pace, origin, motion} = useControls();
  const listSource = listSources[pace][origin][motion];
  const itemSource = itemSources[origin];
  const slide = pace === 'eager' ? <SlideCrossed/> : <SlideSettle listSource={listSource}/>;
  return <>
    <Story titleId="native-sort-story"
      can="The user can arrange the list by hand"
      soThat="it reads in the order they mean">
      <PlatformCurrency/>
      <ListGuarantees/>
      <Steps>
        <ArmTheDrag itemSource={itemSource}/>
        <HoldTheAloft/>
        <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
        {pace === 'eager' && <InnerHalf/>}
        {pace === 'eager' && <CommitCrossing listSource={listSource}/>}
        {pace === 'lazy' && <StashLanding listSource={listSource}/>}
        {origin === 'keep' ? <KeepStanding listSource={listSource}/> : <FadeOrigin itemSource={itemSource}/>}
        {motion === 'static' ? <DirectState listSource={listSource}/> : slide}
        <RoadEnd/>
      </Steps>
    </Story>
    <StraightToOrder gripSource={gripSource}/>
  </>;
};
