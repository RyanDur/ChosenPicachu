import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  DirectState,
  FadeOrigin,
  HoldTheAloft,
  NeverOurs,
  PlatformCurrency,
  Promises,
  RoadEnd,
  StashLanding,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../LazyHideStaticList/LazyHideStaticList.tsx?sample';
import itemSource from '../items/HideItem.tsx?sample';

export const LazyHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="lazy" origin="hide" motion="static"/>
    <NeverOurs/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft listSource={listSource}/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <StashLanding listSource={listSource}/>
      <FadeOrigin itemSource={itemSource}/>
      <DirectState listSource={listSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
