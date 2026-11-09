import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  HoldTheAloft,
  KeepStanding,
  PlatformCurrency,
  Promises,
  RoadEnd,
  SlideSettle,
  StashLanding,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../LazyKeepAnimatedList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';

export const LazyKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="lazy" motion="animated"/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <StashLanding listSource={listSource}/>
      <KeepStanding listSource={listSource}/>
      <SlideSettle listSource={listSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
