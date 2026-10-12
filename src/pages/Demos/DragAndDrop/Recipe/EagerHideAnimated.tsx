import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  CommitCrossing,
  FadeOrigin,
  HoldTheAloft,
  InnerHalf,
  NeverOurs,
  PlatformCurrency,
  Promises,
  RoadEnd,
  SlideCrossed,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerHideAnimatedList/EagerHideAnimatedList.tsx?sample';
import itemSource from '../items/HideItem.tsx?sample';
import cssSource from '../EagerHideAnimatedList/EagerHideAnimatedList.css?sample';

export const EagerHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="eager" origin="hide" motion="animated"/>
    <NeverOurs/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft listSource={listSource}/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <InnerHalf/>
      <CommitCrossing listSource={listSource}/>
      <FadeOrigin itemSource={itemSource}/>
      <SlideCrossed listSource={listSource} cssSource={cssSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
