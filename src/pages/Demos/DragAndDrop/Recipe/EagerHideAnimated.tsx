import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  CommitCrossing,
  FadeOrigin,
  HoldTheAloft,
  InnerHalf,
  PlatformCurrency,
  Promises,
  RoadEnd,
  SlideCrossed,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerHideAnimatedList.tsx?sample';
import itemSource from '../items/HideItem.tsx?sample';

export const EagerHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <InnerHalf/>
      <CommitCrossing listSource={listSource}/>
      <FadeOrigin itemSource={itemSource}/>
      <SlideCrossed/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
