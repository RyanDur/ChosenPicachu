import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  FadeOrigin,
  HoldTheAloft,
  PlatformCurrency,
  Promises,
  RoadEnd,
  SlideSettle,
  StashLanding,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../LazyHideAnimatedList.tsx?sample';
import itemSource from '../items/HideItem.tsx?sample';

export const LazyHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <StashLanding listSource={listSource}/>
      <FadeOrigin itemSource={itemSource}/>
      <SlideSettle listSource={listSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
