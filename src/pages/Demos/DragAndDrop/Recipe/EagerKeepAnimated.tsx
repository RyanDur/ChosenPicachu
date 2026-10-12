import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  CommitCrossing,
  HoldTheAloft,
  InnerHalf,
  KeepStanding,
  NeverOurs,
  PlatformCurrency,
  Promises,
  RoadEnd,
  SlideCrossed,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';
import cssSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.css?sample';

export const EagerKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="eager" origin="keep" motion="animated"/>
    <NeverOurs/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft listSource={listSource}/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <InnerHalf/>
      <CommitCrossing listSource={listSource}/>
      <KeepStanding listSource={listSource}/>
      <SlideCrossed listSource={listSource} cssSource={cssSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
