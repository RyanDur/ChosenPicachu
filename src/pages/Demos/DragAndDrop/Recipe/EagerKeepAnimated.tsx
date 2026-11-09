import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  CommitCrossing,
  HoldTheAloft,
  InnerHalf,
  KeepStanding,
  PlatformCurrency,
  Promises,
  RoadEnd,
  SlideCrossed,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerKeepAnimatedList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';

export const EagerKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="eager" motion="animated"/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <InnerHalf/>
      <CommitCrossing listSource={listSource}/>
      <KeepStanding listSource={listSource}/>
      <SlideCrossed/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
