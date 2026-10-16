import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  GlideSettle,
  HoldTheAloft,
  KeepStanding,
  PlatformCurrency,
  Promises,
  RoadEnd,
  StashLanding,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';

export const LazyKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="lazy" origin="keep" motion="animated"/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft listSource={listSource}/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <StashLanding listSource={listSource}/>
      <KeepStanding listSource={listSource}/>
      <GlideSettle listSource={listSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
